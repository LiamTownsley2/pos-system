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

const createProductSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  forename: z.string().min(1, 'Forename is required'),
  surname: z.string().min(1, 'Surname is required'),
  password: z.string().min(1, 'Password is required')
})

export function CreateStaffUserDialog(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      username: '',
      forename: '',
      surname: '',
      password: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof createProductSchema>): Promise<void> => {
    const _testuser = {
      username: values.username,
      forename: values.forename,
      surname: values.surname,
      password_hash: await window.db.encryptPassword(values.password)
    }
    console.log(_testuser)
    window.db.createStaffUser(_testuser).then((_member) => {
      toast.success(`Created new Staff Member: ${_member.username}`)
      form.reset()
      setOpen(false)
      window.location.reload()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="flex flex-row align-middle gap-2">
          <Plus className="my-auto" /> Create new Staff Member
        </DialogTitle>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="liamtownsley" {...field} />
                  </FormControl>
                  <FormDescription>The username of the Staff Member.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forename</FormLabel>
                  <FormControl>
                    <Input placeholder="Liam" {...field} />
                  </FormControl>
                  <FormDescription>The first name of the Staff Member.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Townsley" {...field} />
                  </FormControl>
                  <FormDescription>The last name of the Staff Member.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>The password of the Staff Member.</FormDescription>
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
