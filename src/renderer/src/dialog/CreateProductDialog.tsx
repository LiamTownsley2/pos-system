import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast, Toaster } from 'sonner'
import React, { useState } from 'react'
import { CheckIcon, Plus, X } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Category } from 'src/types/categories'

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string(),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required')
})

export function CreateProductDialog({ categories }: { categories: Category[] }): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      price: '',
      unit: '',
      category: ''
    }
  })

  const onSubmit = (values: z.infer<typeof createProductSchema>): void => {
    window.db
      .createProduct({
        name: values.name,
        price_per_unit: parseFloat(values.price),
        unit: values.unit,
        category: values.category
      })
      .then((_product) => {
        toast.success(`Created new Product: ${_product.name}`)
        form.reset()
        setOpen(false)
        window.location.reload()
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="flex flex-row align-middle gap-2">
          <Plus className="my-auto" /> Create new Product
        </DialogTitle>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Potato Fertiliser" {...field} />
                  </FormControl>
                  <FormDescription>The name of the product to be sold.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Unit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.01" {...field} />
                  </FormControl>
                  <FormDescription>The price charged per unit sold.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="lbs" {...field} />
                  </FormControl>
                  <FormDescription>
                    The unit to sell the product as (lbs, ltr, etc).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((_category, i) => (
                          <SelectItem key={i} value={_category.id} className="flex flex-row gap-2">
                            <span
                              className="h-3 w-3 rounded-full block my-auto"
                              style={{ backgroundColor: _category.colour }}
                            />
                            {_category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>The category the product is assigned to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <CheckIcon />
                Submit
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
