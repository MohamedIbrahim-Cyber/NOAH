<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Moyasar Payment Webhook Handler with Signature Verification.
     */
    public function handleMoyasar(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $secret = config('services.moyasar.webhook_secret', env('MOYASAR_WEBHOOK_SECRET'));

        // ⚠️ Signature Verification
        if ($secret) {
            $receivedSignature = $request->header('X-Moyasar-Signature');
            $calculatedSignature = hash_hmac('sha256', $payload, $secret);

            if (!hash_equals($calculatedSignature, (string)$receivedSignature)) {
                Log::warning('[Moyasar Webhook] Invalid signature attempted from IP: ' . $request->ip());
                return response()->json(['error' => 'Invalid webhook signature.'], 401);
            }
        }

        $data = $request->json()->all();
        $paymentStatus = $data['status'] ?? null;
        $orderId = $data['metadata']['order_id'] ?? null;

        if (!$orderId) {
            return response()->json(['error' => 'Missing order_id in payment metadata.'], 400);
        }

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['error' => 'Order not found.'], 404);
        }

        if ($paymentStatus === 'paid') {
            DB::transaction(function () use ($order, $data) {
                // Mark order paid
                $order->update([
                    'payment_status' => 'paid',
                    'provider_transaction_id' => $data['id'] ?? $order->provider_transaction_id,
                ]);

                // Create enrollments based on item_type
                if ($order->item_type === 'course') {
                    Enrollment::firstOrCreate([
                        'user_id' => $order->user_id,
                        'course_id' => $order->item_id,
                    ], [
                        'enrolled_at' => now(),
                        'expires_at' => null, // Lifetime access or term expiry
                    ]);
                } elseif ($order->item_type === 'package') {
                    $package = Package::with('courses')->find($order->item_id);
                    if ($package) {
                        foreach ($package->courses as $course) {
                            Enrollment::firstOrCreate([
                                'user_id' => $order->user_id,
                                'course_id' => $course->id,
                            ], [
                                'enrolled_at' => now(),
                                'expires_at' => null,
                            ]);
                        }
                    }
                }
            });

            Log::info("[Moyasar Webhook] Order #{$order->id} successfully fulfilled and enrolled for user #{$order->user_id}.");

            return response()->json([
                'status' => 'success',
                'message' => 'Order paid and enrollments created successfully.',
            ]);
        }

        if ($paymentStatus === 'failed') {
            $order->update(['payment_status' => 'failed']);
            return response()->json(['status' => 'handled', 'message' => 'Order marked failed.']);
        }

        return response()->json(['status' => 'ignored']);
    }
}
