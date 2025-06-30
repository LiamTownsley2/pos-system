import { Folders, List } from 'lucide-react'
import { Separator } from '@renderer/components/ui/separator'
import { InventoryTable } from '@renderer/components/tables/inventory/InventoryTable'
import { CategoryTable } from '@renderer/components/tables/category/CategoryTable'
import { useEffect, useState } from 'react'
import { Category } from 'src/types/categories'
import { Product } from 'src/types/product'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Card, CardContent } from '@renderer/components/ui/card'
import { CreateProductDialog } from '@renderer/dialog/CreateProductDialog'
import { CreateCategoryDialog } from '@renderer/dialog/CreateCategoryDialog'

export default function Inventory(): React.JSX.Element {
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)
  const [products, setProducts] = useState<Product[] | undefined>(undefined)

  useEffect(() => {
    function fetchCategories(): void {
      window.db.getAllCategories().then((_categories) => {
        setCategories(_categories)
      })
    }

    function fetchProducts(): void {
      window.db.getAllProducts().then((_products) => {
        setProducts(_products)
      })
      // setProducts([
      //   {
      //     id: '1',
      //     name: 'Potato Fertiliser',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '2',
      //     name: 'Growmore',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '3',
      //     name: 'Hoof & Horn',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '4',
      //     name: 'Bone Meal',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '5',
      //     name: 'Fish / Blood Bone',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '6',
      //     name: 'Sulpher Potash',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '7',
      //     name: 'Sulpher Amonia',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '8',
      //     name: 'Sulpher Phosphate',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '9',
      //     name: 'Dried Blood',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '0'
      //   },
      //   {
      //     id: '10',
      //     name: 'Lime',
      //     unit: 'lbs',
      //     price_per_unit: 0.6,
      //     category: '1'
      //   },
      //   {
      //     id: '11',
      //     name: 'Mustard Seed',
      //     unit: 'lbs',
      //     price_per_unit: 1.7,
      //     category: '4'
      //   },
      //   {
      //     id: '12',
      //     name: 'Compost',
      //     unit: '60 ltr',
      //     price_per_unit: 7.0,
      //     category: '1'
      //   },
      //   {
      //     id: '13',
      //     name: 'Growbags',
      //     unit: 'bag',
      //     price_per_unit: 3.0,
      //     category: '1'
      //   },
      //   {
      //     id: '14',
      //     name: 'Growbags X6',
      //     unit: 'bundle',
      //     price_per_unit: 10.0,
      //     category: '1'
      //   },
      //   {
      //     id: '15',
      //     name: 'Slug Pellets',
      //     unit: 'pkt',
      //     price_per_unit: 2.5,
      //     category: '2'
      //   },
      //   {
      //     id: '16',
      //     name: 'Tomato Food',
      //     unit: 'pkt',
      //     price_per_unit: 2.5,
      //     category: '2'
      //   },
      //   {
      //     id: '17',
      //     name: 'Fleece',
      //     unit: 'mtr',
      //     price_per_unit: 0.6,
      //     category: '2'
      //   },
      //   {
      //     id: '18',
      //     name: "8' Cane",
      //     unit: 'each',
      //     price_per_unit: 0.7,
      //     category: '3'
      //   },
      //   {
      //     id: '19',
      //     name: "6' Cane",
      //     unit: 'each',
      //     price_per_unit: 0.45,
      //     category: '3'
      //   },
      //   {
      //     id: '20',
      //     name: "4' Cane",
      //     unit: 'each',
      //     price_per_unit: 0.35,
      //     category: '3'
      //   },
      //   {
      //     id: '21',
      //     name: 'Seed Pots',
      //     unit: 'lbs',
      //     price_per_unit: 0.7,
      //     category: '4'
      //   },
      //   {
      //     id: '22',
      //     name: 'Onion Sets',
      //     unit: '½ lb',
      //     price_per_unit: 1.0,
      //     category: '4'
      //   },
      //   {
      //     id: '23',
      //     name: 'Paraffin Garden',
      //     unit: '4 ltr',
      //     price_per_unit: 3.5,
      //     category: '5'
      //   },
      //   {
      //     id: '24',
      //     name: 'Paraffin Outside',
      //     unit: '4 ltr',
      //     price_per_unit: 4.5,
      //     category: '5'
      //   }
      // ])
    }
    fetchCategories()
    fetchProducts()
  }, [])

  return (
    <div className="p-4 pt-0">
      <div className="my-4">
        <h1 className="font-bold text-3xl text-center mb-4">Inventory Management</h1>
        <Separator />
      </div>
      <Card>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">
                <List /> Manage Products
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Folders /> Manage Categories
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <div className="mb-2">
                {categories && <CreateProductDialog categories={categories} />}
              </div>
              {products && <InventoryTable inventory={products} />}
            </TabsContent>
            <TabsContent value="categories">
              <div className="mb-2">
                <CreateCategoryDialog />
              </div>
              {categories && <CategoryTable categories={categories} />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
