import { Link } from "react-router-dom"

import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-slate-200 flex items-center justify-center text-slate-500">
          No image
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold">
            ${product.price.toFixed(2)}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
