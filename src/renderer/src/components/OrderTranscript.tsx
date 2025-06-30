import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import {
  AlertTriangleIcon,
  Calculator,
  Check,
  CircleDollarSignIcon,
  Edit,
  Fingerprint,
  Minus,
  Plus,
  User,
  Wallet,
  X
} from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
import { TranscriptProduct } from 'src/types/product'
import { Member } from 'src/types/member'

export default function OrderTranscript({
  member,
  transcriptProducts,
  setTranscriptProducts
}: {
  member: Member | null
  transcriptProducts: TranscriptProduct[] | null
  setTranscriptProducts: React.Dispatch<React.SetStateAction<TranscriptProduct[] | null>>
}): React.JSX.Element {
  const [paymentOption, setPaymentOption] = useState<'cash' | 'balance' | null>(null)
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  })
  const running_total =
    transcriptProducts?.reduce(
      (total, product) => total + product.price_per_unit * product.amount,
      0
    ) || 0
  const overflow_balance = running_total - (member?.balance || 0)
  /* export type Receipt = {
  id: string
  member_id: string | null
  total: number
  prepaid_used: number
  cash_paid: number
  created_at: number
}

export type ReceiptItem = {
  id: string
  receipt_id: string
  product_id: string
  quantity: number
  price_per_unit: number
}
 */
  async function completeTransaction(): Promise<void> {
    let prepaid_used = 0
    let cash_paid = 0
    if (!member?.id || member.id == null) return
    if (paymentOption === 'balance' && (member?.balance || 0) > 0) {
      prepaid_used = Math.min(running_total, member?.balance || 0)
      cash_paid = running_total - prepaid_used
    } else if (paymentOption === 'cash') {
      prepaid_used = 0
      cash_paid = running_total
    }
    const receipt = await window.db.createReceipt({
      member_id: member.id,
      total: running_total,
      prepaid_used,
      cash_paid
    })
    console.log('Receipt', receipt)

    for (const item of transcriptProducts || []) {
      await window.db.createReceiptItem({
        receipt_id: receipt.id,
        product_id: item.id,
        name: item.name,
        quantity: item.amount,
        price_per_unit: item.price_per_unit,
        unit: item.unit
      })
      await window.db.createStockMovement({
        product_id: item.id,
        quantity: item.amount,
        type: 'out'
      })
    }

    if (prepaid_used > 0)
      await window.db.createBalanceMovement({
        member_id: member.id,
        type: 'out',
        amount: prepaid_used
      })

    setTranscriptProducts([])
    setPaymentOption(null)
    window.location.hash = `#/pos`
  }

  return (
    <Card className="p-4 flex flex-col gap-2 w-1/4">
      <header>
        <h1 className="text-2xl font-bold">Current Order</h1>
      </header>
      <Separator />
      <main className="flex flex-col">
        <Card className="mb-2">
          <CardContent>
            <div className="flex flex-row h-full">
              <div className="flex flex-col grow">
                <p className="flex flex-row gap-2">
                  <User /> {member?.title}. {member?.forename} {member?.surname}
                </p>
                <p className="flex flex-row gap-2">
                  <Fingerprint />
                  {member?.short_id}
                </p>
              </div>
              <Button
                className="text-xs h-full"
                variant={'outline'}
                onClick={() => {
                  window.location.hash = `#/pos`
                }}
              >
                <Edit />
              </Button>
            </div>
          </CardContent>
        </Card>
        <ScrollArea className="h-[50vh] w-full rounded-md border p-4 mb-2">
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
              {transcriptProducts &&
                transcriptProducts.map((product, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-1">{product.name}</td>
                    <td className="py-1 text-center">{product.amount}</td>
                    <td className="py-1 text-right">{formatter.format(product.price_per_unit)}</td>
                    <td className="py-1 text-right">
                      {formatter.format(product.price_per_unit * product.amount)}
                    </td>
                    <td className="py-1 pl-4 flex flex-row gap-1">
                      <Button
                        variant="outline"
                        className="h-4 w-4"
                        onClick={() => {
                          setTranscriptProducts((prev) =>
                            prev
                              ? prev.map((p, idx) =>
                                  idx === i ? { ...p, amount: p.amount + 1 } : p
                                )
                              : prev
                          )
                        }}
                      >
                        <Plus />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-4 w-4"
                        onClick={() => {
                          setTranscriptProducts((prev) =>
                            prev
                              ? prev
                                  .map((p, idx) => (idx === i ? { ...p, amount: p.amount - 1 } : p))
                                  .filter((p) => p.amount > 0)
                              : prev
                          )
                        }}
                      >
                        <Minus />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-4 w-4"
                        onClick={() => {
                          setTranscriptProducts((prev) =>
                            prev ? prev.filter((_, idx) => idx !== i) : prev
                          )
                        }}
                      >
                        <X />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ScrollArea>
        <Card>
          <CardTitle className="hidden">Order Overview</CardTitle>
          <CardContent>
            <div className="flex flex-row gap-1">
              <Calculator />
              <p>Running Total: </p>
              <p className="font-bold">{formatter.format(running_total)}</p>
            </div>
            <div className="flex flex-row gap-1">
              <Wallet />
              <p>Member Prepaid Balance: </p>
              <p className="font-bold">{formatter.format(member?.balance || 0)}</p>
            </div>
            {paymentOption == 'balance' && overflow_balance > 0 && (
              <div className="text-yellow-500">
                <div className="flex flex-row gap-2">
                  <AlertTriangleIcon />
                  <p>Total is greater than prepaid balance.</p>
                </div>
                <p>
                  Remaining <strong>{formatter.format(overflow_balance)}</strong> must be paid in
                  cash.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="mt-auto">
        <div className="text-xs text-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col">
              <Button
                variant={paymentOption === 'cash' ? 'default' : 'outline'}
                onClick={() => setPaymentOption('cash')}
              >
                <CircleDollarSignIcon />
              </Button>
              <p className="pt-2 select-none">Cash</p>
            </div>
            <div className="flex flex-col">
              <Button
                variant={paymentOption === 'balance' ? 'default' : 'outline'}
                disabled={(member?.balance || 0) <= 0}
                onClick={() => setPaymentOption('balance')}
              >
                <Wallet />
              </Button>
              <p className="pt-2 select-none">Prepaid Balance</p>
            </div>
          </div>
          <Separator orientation="horizontal" className="my-4" />
          <div className="h-15 w-full flex gap-2">
            <Button className="h-full flex-1" onClick={completeTransaction}>
              <Check />
              Complete Transaction
            </Button>
            {/* <Button className="h-full" variant={'secondary'}>
              <Clock />
              Hold Order
            </Button> */}
          </div>
        </div>
      </footer>
    </Card>
  )
}
