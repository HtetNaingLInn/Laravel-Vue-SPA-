<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index()
    {

        return Product::when(request('search'), function ($query) {
            $query->where('name', 'like', '%' . request('search') . '%')->paginate('5');
        })->orderby('id', 'desc')->paginate('5');

    }

    public function store(ProductRequest $request)
    {
        $product = Product::create($request->only('name', 'price'));
        return $product;
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {

        $product->update($request->only('name', 'price'));
        return $product;

    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['data' => 'deletd'], 200);
    }
}
