import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast, Toaster } from 'sonner'
import React, { useEffect, useState } from 'react'
import { CheckIcon, Mail, X } from 'lucide-react'
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
import { Textarea } from '@renderer/components/ui/textarea'
import { useAuth } from '@renderer/components/AuthContext'
import { StaffUser } from 'src/types/staff_users'

const sendMessageSchema = z.object({
  title: z.string().min(1, 'Name is required'),
  recipient: z.string().min(1, 'Recipient is required'),
  content: z.string().min(1, 'Content is required')
})

export function SendMessageDialog(): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const [staffList, setStaffList] = useState<StaffUser[]>([])

  const { user } = useAuth()
  useEffect(() => {
    window.db.listStaffUsers().then(setStaffList)
  }, [])

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      title: '',
      recipient: '',
      content: ''
    }
  })
  const onSubmit = async (values: z.infer<typeof sendMessageSchema>): Promise<void> => {
    const inbox_message = await window.db.createInbox({
      title: values.title,
      recipient_id: values.recipient,
      content: values.content,
      read_at: null,
      sender_id: user!.id
    })
    toast.success(`Sucesfully sent Mail: ${inbox_message.title}`)
    form.reset()
    setOpen(false)
    window.location.reload()
    //   })
    console.log(values)
    // window.db
    //   .createProduct({
    //     title: values.title,
    //     recipient: values.recipient,
    //     content: values.content
    //   })
  }
  if (!user) return <p>ERROR</p>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Mail className="mr-2 h-4 w-4" /> Send New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="flex flex-row align-middle gap-2">
          <Mail className="my-auto" /> Send New Message
        </DialogTitle>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Email title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffList
                          .filter((staff) => staff.id !== user.id)
                          .map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.forename} {staff.surname} ({staff.username})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Email content" className="min-h-4xl" {...field} />
                  </FormControl>
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
