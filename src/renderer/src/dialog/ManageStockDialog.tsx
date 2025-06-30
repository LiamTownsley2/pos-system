import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast, Toaster } from 'sonner'
import React, { useState } from 'react'
import { BoxIcon, CheckIcon, X } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Separator } from '@renderer/components/ui/separator'

const manageStockSchema = z.object({
  action: z.enum(['in', 'out']),
  amount: z.coerce.number().positive('Amount must be greater than 0')
})

export function ManageStockDialog({ product_id }: { product_id: string }): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof manageStockSchema>>({
    resolver: zodResolver(manageStockSchema),
    defaultValues: {
      action: 'in',
      amount: 1
    }
  })

  const onSubmit = (values: z.infer<typeof manageStockSchema>): void => {
    window.db
      .createStockMovement({
        type: values.action,
        quantity: values.amount,
        product_id
      })
      .then(() => {
        toast.success(
          `Modified stock count ${values.action == 'in' ? 'added' : 'removed'} ${values.amount} of items.`
        )
        form.reset()
        setOpen(false)
        window.location.reload()
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <BoxIcon /> Manage Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="flex flex-row align-middle gap-2">
          <BoxIcon className="my-auto" /> Manage Stock
        </DialogTitle>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full rounded-md border px-3 py-2">
                      <option value="in">Add Stock</option>
                      <option value="out">Remove Stock</option>
                    </select>
                  </FormControl>
                  <FormDescription>Select whether to add or remove stock.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormDescription>How much stock to {form.watch('action')}.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <CheckIcon />
                Create new Category
              </Button>
              <DialogClose asChild>
                <Button type="button" variant={'secondary'} onClick={() => form.reset()}>
                  <X className="mr-1 h-4 w-4" /> Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
      <Toaster position="top-center" richColors />
    </Dialog>
  )
}
