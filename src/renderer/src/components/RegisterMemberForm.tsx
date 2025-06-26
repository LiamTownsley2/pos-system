import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import React from 'react'
import { Check, X } from 'lucide-react'
import { Toaster } from './ui/sonner'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const titles = [
  'Mr',
  'Mrs',
  'Miss',
  'Ms',
  'Dr',
  'Prof',
  'Rev',
  'Fr',
  'Sir',
  'Dame',
  'Lord',
  'Lady'
] as const

const formSchema = z.object({
  title: z.string().refine((val) => titles.includes(val as (typeof titles)[number]), {
    message: 'Please select a valid title.'
  }),
  forename: z.string().min(2, 'Forename must be at least 2 characters.'),
  surname: z.string().min(2, 'Surname must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  garden: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num > 0 && num < 100
    },
    { message: 'Garden Number must be a number between 1 and 99' }
  ),
  phone: z
    .string()
    .regex(
      /^(?:\+|00)?\d{1,4}?[ -]?(?:\(?\d{1,4}\)?[ -]?)*\d{3,4}[ -]?\d{3,4}$/,
      'Invalid phone number.'
    )
})

export function RegisterMemberForm(): React.JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      forename: '',
      surname: '',
      garden: '',
      email: '',
      phone: ''
    }
  })

  const onSubmit = React.useCallback(
    (values: z.infer<typeof formSchema>) => {
      console.log(values)
      window.db
        .createMember({
          title: values.title,
          forename: values.forename,
          surname: values.surname,
          email: values.email,
          phone: values.phone
        })
        .then((member) => {
          toast.success('Member Registered Sucesfully', {
            description: `${member.title}. ${member.surname} (${member.id}) has been registered sucesfully for Garden ${values.garden}`
          })
          form.reset()
        })
    },
    [form]
  )

  const action_row = (
    <>
      <div className="flex flex-row gap-2">
        <Button type="submit" className="flex-1">
          <Check /> Create User
        </Button>
        <Button type="reset" className="w-1/4" variant={'secondary'} onClick={() => form.reset()}>
          <X /> Cancel Registration
        </Button>
      </div>
      <div />
    </>
  )

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-row gap-4">
            <div className="mt-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titles.map((title, i) => (
                          <SelectItem key={i} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select member&apos;s title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="forename"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Forename</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormDescription>This is the member&apos;s first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormDescription>This is the member&apos;s last name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormDescription>This is the member&apos;s email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="garden"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garden Number</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>This is the member&apos;s garden number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+447123456789" {...field} />
                </FormControl>
                <FormDescription>Include country code if international.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {action_row}
        </form>
      </Form>
      <Toaster position="top-center" richColors />
    </>
  )
}
