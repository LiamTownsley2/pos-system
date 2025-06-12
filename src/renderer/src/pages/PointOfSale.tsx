import { AddItemDrawer } from '@renderer/components/AddItemDrawer'
import CategoryCarousel from '@renderer/components/CategoryCarousel'
import OrderTranscript from '@renderer/components/OrderTranscript'
import ProductGrid from '@renderer/components/ProductGrid'
import { Separator } from '@renderer/components/ui/separator'
import { Product } from '@renderer/lib/test-data'
import { useState } from 'react'

export default function PointOfSale(): React.JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <main className="mx-4">
      <div className="flex flex-row gap-8">
        <main className=" grow w-full flex-1 h-svh mb-[-100px]">
          <CategoryCarousel />
          <Separator className="my-4" />
          <ProductGrid setSelectedProduct={setSelectedProduct} setDrawerOpen={setDrawerOpen} />
        </main>
        <OrderTranscript />
      </div>
      <AddItemDrawer
        selectedProduct={selectedProduct}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </main>
  )
}
