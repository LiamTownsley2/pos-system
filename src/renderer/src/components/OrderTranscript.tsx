import React from 'react'
import { Card } from './ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { Check, CircleDollarSignIcon, Clock, Edit, Wallet, X } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'

export default function OrderTranscript(): React.JSX.Element {
  return (
    <Card className="p-4 flex flex-col gap-2 w-1/4 h-auto">
      <header>
        <h1 className="text-2xl font-bold">Current Order</h1>
      </header>
      <Separator />
      <main className="flex flex-col h-full">
        <ScrollArea className="h-[70vh] w-[350px] rounded-md border p-4 ">
          <table className="w-full text-sm table-auto px-4">
            <thead>
              <tr className="text-left font-semibold border-b">
                <th className="pb-2">Item</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Each</th>
                <th className="pb-2 text-right">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 25 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="py-1">Dried Blood</td>
                  <td className="py-1 text-center">10</td>
                  <td className="py-1 text-right">£2.30</td>
                  <td className="py-1 text-right">£23.00</td>
                  <td className="py-1 pl-4 flex flex-row gap-1">
                    <Button variant="outline" className="h-8 w-8">
                      <Edit />
                    </Button>
                    <Button variant="outline" className="h-8 w-8">
                      <X />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
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
          <div className="h-15 w-full flex gap-2">
            <Button className="h-full flex-1">
              <Check />
              Complete Transaction
            </Button>
            <Button className="h-full" variant={'secondary'}>
              <Clock />
              Hold Order
            </Button>
          </div>
        </div>
      </footer>
    </Card>
  )
}
