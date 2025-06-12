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
import { Product } from '@renderer/lib/test-data'
import { useState } from 'react'

export function AddItemDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedProduct
}: {
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedProduct?: Product | null
}): React.JSX.Element {
  const [goal, setGoal] = useState(1)
  function onClick(adjustment: number): void {
    setGoal(Math.max(1, Math.min(100, goal + adjustment)))
  }

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
  )
}
