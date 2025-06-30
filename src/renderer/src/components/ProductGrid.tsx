import { Product } from 'src/types/product'
import ProductCard from './ProductCard'

export default function ProductGrid({
  products,
  setSelectedProduct,
  setDrawerOpen
}: {
  products: Product[]
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4">
      {products &&
        products
          // .sort((a, b) => a.category.localeCompare(b.category))
          .map((product, i) => {
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
