<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Models\Course;
use App\Models\Order;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CheckoutController extends Controller
{
    /**
     * Create Pending Order & Init Moyasar Session.
     */
    public function createOrder(CreateOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $amount = 0;
        $title = '';

        if ($validated['item_type'] === 'course') {
            $course = Course::findOrFail($validated['item_id']);
            $amount = $course->price;
            $title = $course->title;
        } else {
            $package = Package::findOrFail($validated['item_id']);
            $amount = $package->price;
            $title = $package->title;
        }

        // Create pending order
        $order = Order::create([
            'user_id' => $user->id,
            'item_type' => $validated['item_type'],
            'item_id' => $validated['item_id'],
            'amount' => $amount,
            'payment_provider' => 'moyasar',
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
        ]);

        // Moyasar Invoice / Payment Request (amount in halalas: SAR * 100)
        $amountInHalalas = (int) round($amount * 100);
        $moyasarSecretKey = config('services.moyasar.secret_key', env('MOYASAR_API_KEY', 'sk_test_demo'));

        // If in real production with Moyasar credentials configured
        $invoiceUrl = null;
        if (env('MOYASAR_API_KEY') && !str_starts_with(env('MOYASAR_API_KEY'), 'sk_test_demo')) {
            $response = Http::withBasicAuth($moyasarSecretKey, '')
                ->post('https://api.moyasar.com/v1/invoices', [
                    'amount' => $amountInHalalas,
                    'currency' => 'SAR',
                    'description' => "شراء {$title} - منصة نوح التعليمية (طلب #{$order->id})",
                    'callback_url' => url("/checkout/callback?order_id={$order->id}"),
                    'metadata' => [
                        'order_id' => $order->id,
                        'user_id' => $user->id,
                    ],
                ]);

            if ($response->successful()) {
                $invoiceUrl = $response->json('url');
                $order->update(['provider_transaction_id' => $response->json('id')]);
            }
        }

        return response()->json([
            'message' => 'تم إنشاء الطلب وجاهز للدفع عبر مدى / STC Pay / البطاقة الائتمانية.',
            'order' => $order,
            'checkout_url' => $invoiceUrl ?? url("/checkout/simulate?order_id={$order->id}"),
            'amount_sar' => $amount,
            'currency' => 'SAR',
        ], 201);
    }

    /**
     * Get Student Orders List.
     */
    public function orders(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    /**
     * Get Single Order with strict IDOR prevention.
     */
    public function showOrder(Request $request, int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        // Broken Access Control check: only owner or admin can view order
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'error' => 'غير مصرح لك بالاطلاع على تفاصيل هذا الطلب.',
                'code' => 'FORBIDDEN_ACCESS',
            ], 403);
        }

        return response()->json([
            'order' => $order,
        ]);
    }
}
