import { Product, ProductData } from '@renderer/lib/test-data'
import ProductCard from './ProductCard'

export default function ProductGrid({
  setSelectedProduct,
  setDrawerOpen
}: {
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4">
      {ProductData.sort((a, b) => a.category - b.category).map((product, i) => {
        return (
          <ProductCard
            key={i}
            product={product}
            onClick={() => {
              setSelectedProduct(product)
              setDrawerOpen(true)
            }}
          />
        )
      })}
    </div>
  )
}
