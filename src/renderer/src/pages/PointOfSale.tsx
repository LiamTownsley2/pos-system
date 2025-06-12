import ProductCard from '@renderer/components/ProductCard'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@renderer/components/ui/carousel'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@renderer/components/ui/drawer'
import { Separator } from '@renderer/components/ui/separator'
import { CategoryData, Product, ProductData } from '@renderer/lib/test-data'
import { CircleDollarSignIcon, Edit, Minus, Plus, PlusCircleIcon, Wallet, X } from 'lucide-react'
import { useState } from 'react'

export default function PointOfSale(): React.JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [goal, setGoal] = useState(1)
  function onClick(adjustment: number): void {
    setGoal(Math.max(1, Math.min(100, goal + adjustment)))
  }
  return (
    <main className="m-4">
      <div className="flex flex-row gap-8">
        <main className=" grow w-full flex-1 h-svh mb-[-100px]">
          <div className="mb-4 mx-8">
            <Carousel
              className="select-none"
              opts={{
                dragFree: true
              }}
            >
              <CarouselContent>
                <CarouselItem className="basis-1/3">
                  <Card className={`text-center flex flex-row justify-center items-center gap-3`}>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#000000' }} />
                    <div className="flex flex-row gap-3">
                      <p>All</p>
                      <p>
                        {'('}
                        <strong>{ProductData.length}</strong> items)
                      </p>
                    </div>
                  </Card>
                </CarouselItem>
                {CategoryData.map((category, i) => (
                  <CarouselItem key={i} className="basis-1/3">
                    <Card className={`text-center flex flex-row justify-center items-center gap-3`}>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category?.colour }}
                      />
                      <div className="flex flex-row gap-3">
                        <p>{category.name.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p>
                          {'('}
                          <strong>
                            {
                              ProductData.filter((product) => product.category == category.id)
                                .length
                            }
                          </strong>{' '}
                          items)
                        </p>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-5 gap-8">
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
        </main>
        <Card className="p-4 flex flex-col gap-2 w-1/4 h-auto">
          <header>
            <h1 className="text-2xl font-bold">Current Order</h1>
          </header>
          <Separator />
          <main>
            <table className="w-full text-sm table-auto px-4">
              <thead>
                <tr className="text-left font-semibold border-b">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Each</th>
                  <th className="py-2 text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-1">Dried Blood</td>
                  <td className="py-1 text-center">10</td>
                  <td className="py-1 text-right">£2.30</td>
                  <td className="py-1 text-right">£23.00</td>
                  <td className="py-1 pl-4 flex flex-row gap-1">
                    <Button variant={'outline'} className="h-8 w-8">
                      <Edit />
                    </Button>
                    <Button variant={'outline'} className="h-8 w-8">
                      <X />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </main>
          <footer className="mt-auto">
            <div className="text-xs text-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col">
                  <Button variant={'outline'}>
                    <CircleDollarSignIcon />
                  </Button>
                  <p className="pt-2">Cash</p>
                </div>
                <div className="flex flex-col">
                  <Button variant={'outline'}>
                    <Wallet />
                  </Button>
                  <p className="pt-2">Prepaid Balance</p>
                </div>
              </div>
              <Separator orientation="horizontal" className="my-4" />
              <Button className="h-15 w-full">Complete Transaction</Button>
            </div>
          </footer>
        </Card>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} onClose={() => setGoal(1)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>How many do you want?</DrawerTitle>
              <DrawerDescription>
                Please enter the total amount of &quot;{selectedProduct?.name}&quot; that you would
                like to add to the order.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(-1)}
                  disabled={goal <= 1}
                >
                  <Minus />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">{goal}</div>
                  <div className="text-muted-foreground text-[0.70rem] uppercase">
                    {selectedProduct?.unit}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(1)}
                  disabled={goal >= 100}
                >
                  <Plus />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </div>
            <DrawerFooter className="flex flex-row">
              <Button className="flex-1">
                <PlusCircleIcon /> Add to Order
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">
                  <X /> Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  )
}
