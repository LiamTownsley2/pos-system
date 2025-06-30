import { Minus, Plus, PlusCircleIcon, X } from 'lucide-react'
import { Button } from './ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from './ui/drawer'
import { useState } from 'react'
import { Product, TranscriptProduct } from 'src/types/product'

export function AddItemDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedProduct,
  setTranscriptProducts
}: {
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedProduct?: Product | null
  setTranscriptProducts: React.Dispatch<React.SetStateAction<TranscriptProduct[] | null>>
}): React.JSX.Element {
  const [goal, setGoal] = useState(1)
  function onClick(adjustment: number): void {
    setGoal(Math.max(1, Math.min(100, goal + adjustment)))
  }

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  })
  return (
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
                  {selectedProduct?.price_per_unit &&
                    formatter.format(selectedProduct?.price_per_unit)}{' '}
                  / {selectedProduct?.unit} ={' '}
                  <span>{formatter.format((selectedProduct?.price_per_unit || 0) * goal)}</span>
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
            <Button
              className="flex-1"
              onClick={() => {
                if (
                  selectedProduct &&
                  selectedProduct.id &&
                  selectedProduct.name &&
                  selectedProduct.price_per_unit !== undefined &&
                  selectedProduct.unit
                ) {
                  setTranscriptProducts((prev) => {
                    const current = prev ?? []
                    const existingIndex = current.findIndex(
                      (item) => item.id === selectedProduct.id
                    )
                    if (existingIndex !== -1) {
                      // Update the amount of the existing item
                      const updated = [...current]
                      updated[existingIndex] = {
                        ...updated[existingIndex],
                        amount: updated[existingIndex].amount + goal
                      }
                      return updated
                    } else {
                      // Add as new item
                      return [
                        ...current,
                        {
                          id: selectedProduct.id,
                          name: selectedProduct.name,
                          price_per_unit: selectedProduct.price_per_unit,
                          unit: selectedProduct.unit,
                          amount: goal
                        }
                      ]
                    }
                  })
                }
                setDrawerOpen(false)
                setGoal(1)
              }}
            >
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
  )
}
