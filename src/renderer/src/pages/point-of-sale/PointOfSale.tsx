import { AddItemDrawer } from '@renderer/components/AddItemDrawer'
import CategoryCarousel from '@renderer/components/CategoryCarousel'
import OrderTranscript from '@renderer/components/OrderTranscript'
import ProductGrid from '@renderer/components/ProductGrid'
import { Separator } from '@renderer/components/ui/separator'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Category } from 'src/types/categories'
import { Member } from 'src/types/member'
import { Product, TranscriptProduct } from 'src/types/product'

export default function PointOfSale(): React.JSX.Element {
  const { member_id } = useParams()
  const [member, setMember] = useState<Member | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [products, setProducts] = useState<Product[] | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategory, setFilteredCategory] = useState<Category | null>(null)
  const [transcriptProducts, setTranscriptProducts] = useState<TranscriptProduct[] | null>(null)

  useEffect(() => {
    async function fetchCategories(): Promise<void> {
      const _categories = await window.db.getAllCategories()
      setCategories(_categories)
    }
    async function fetchProducts(): Promise<void> {
      const _products = await window.db.getAllProducts()
      setProducts(_products)
    }
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    async function fetchMember(): Promise<void> {
      if (member_id) {
        const _member = await window.db.getMemberById(member_id)
        setMember(_member)
      }
    }
    fetchMember()
  }, [member_id])

  return (
    <main className="mx-4 overflow-y-hidden">
      <div className="flex flex-row gap-8">
        <main className=" grow w-full flex-1 h-svh mb-[-100px]">
          {products && categories && (
            <CategoryCarousel
              products={products}
              categories={categories}
              filteredCategory={filteredCategory}
              setFilteredCategory={setFilteredCategory}
            />
          )}
          <Separator className="my-4" />
          {products && (
            <div className="pb-10 h-[80%] pr-5 overflow-x-auto">
              <ProductGrid
                products={products.filter((product) =>
                  filteredCategory?.id == '-1' || filteredCategory == null
                    ? true
                    : product.category == filteredCategory?.id
                )}
                setSelectedProduct={setSelectedProduct}
                setDrawerOpen={setDrawerOpen}
              />
            </div>
          )}
        </main>
        <OrderTranscript
          member={member}
          transcriptProducts={transcriptProducts}
          setTranscriptProducts={setTranscriptProducts}
        />
      </div>
      <AddItemDrawer
        selectedProduct={selectedProduct}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        setTranscriptProducts={setTranscriptProducts}
      />
    </main>
  )
}
