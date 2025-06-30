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
import ColourSelectorButton from '@renderer/components/ColourSelectorButton'
import { Separator } from '@renderer/components/ui/separator'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  colour: z.string().min(1, 'Category is required')
})

export function CreateCategoryDialog(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      colour: '#cd2c2c'
    }
  })

  const onSubmit = (values: z.infer<typeof createCategorySchema>): void => {
    window.db
      .createCategory({
        name: values.name,
        colour: values.colour
      })
      .then(() => {
        toast.success(`Created new Category: ${values.name}`)
        form.reset()
        setOpen(false)
        window.location.reload()
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="flex flex-row align-middle gap-2">
          <Plus className="my-auto" /> Create new Category
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
                    <Input placeholder="Fertilisers" {...field} />
                  </FormControl>
                  <FormDescription>The name of the category.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colour</FormLabel>
                  <FormControl>
                    <ColourSelectorButton {...field} />
                  </FormControl>
                  <FormDescription>The colour that corrosponds with this category.</FormDescription>
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
