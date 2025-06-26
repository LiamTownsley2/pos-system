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
import { Search, X } from 'lucide-react'
import { Toaster } from './ui/sonner'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const nameFormSchema = z
  .object({
    forename: z.string().optional(),
    surname: z.string().optional()
  })
  .refine((data) => !!data.forename?.trim() || !!data.surname?.trim(), {
    message: 'Provide at least a forename or surname.'
  })
  .refine((data) => !data.forename || data.forename.length >= 1, {
    path: ['forename'],
    message: 'Forename must be at least 1 characters.'
  })
  .refine((data) => !data.surname || data.surname.length >= 1, {
    path: ['surname'],
    message: 'Surname must be at least 1 characters.'
  })

const memberIdFormSchema = z.object({
  member_id: z.string().min(2, 'Membership ID must be at least 2 characters.')
})

export function LookupForm({
  setSearchData
}: {
  setSearchData: (
    data:
      | { type: 'name'; forename: string; surname: string }
      | { type: 'id'; member_id: string }
      | undefined
  ) => void
}): React.JSX.Element {
  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      forename: '',
      surname: ''
    }
  })

  const memberIdForm = useForm<z.infer<typeof memberIdFormSchema>>({
    resolver: zodResolver(memberIdFormSchema),
    defaultValues: {
      member_id: ''
    }
  })

  const onNameSubmit = React.useCallback(
    (values: z.infer<typeof nameFormSchema>) => {
      setSearchData({
        type: 'name',
        forename: values.forename ?? '',
        surname: values.surname ?? ''
      })
      toast.success('Fetched user by Name')
      nameForm.reset()
    },
    [nameForm, setSearchData]
  )

  const onMemberIdSubmit = React.useCallback(
    (values: z.infer<typeof memberIdFormSchema>) => {
      setSearchData({ type: 'id', member_id: values.member_id })
      toast.success('Fetched user by ID')
      window.db.getMemberById(values.member_id).then((member) => {
        memberIdForm.reset()
        window.location.hash = `#/member/${member.short_id}`
      })
    },
    [memberIdForm, setSearchData]
  )

  const name_form = (
    <Form {...nameForm}>
      <form onSubmit={nameForm.handleSubmit(onNameSubmit)}>
        <div className="flex flex-row gap-4">
          <FormField
            control={nameForm.control}
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
            control={nameForm.control}
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
        <div className="flex flex-row gap-2 mt-4">
          <Button type="submit" className="flex-1">
            <Search /> Search for Member
          </Button>
          <Button
            type="reset"
            className="w-1/4"
            variant={'secondary'}
            onClick={() => {
              nameForm.reset()
              window.location.reload()
            }}
          >
            <X /> Cancel
          </Button>
        </div>
      </form>
    </Form>
  )

  const member_id_form = (
    <Form {...memberIdForm}>
      <form onSubmit={memberIdForm.handleSubmit(onMemberIdSubmit)}>
        <FormField
          control={memberIdForm.control}
          name="member_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Membership ID</FormLabel>
              <FormControl>
                <Input placeholder="AGL23H4TSJ" {...field} />
              </FormControl>
              <FormDescription>This is the member&apos;s ID number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 mt-4">
          <Button type="submit" className="flex-1">
            <Search /> Search for Member
          </Button>
          <Button
            type="reset"
            className="w-1/4"
            variant={'secondary'}
            onClick={() => {
              memberIdForm.reset()
              window.location.reload()
            }}
          >
            <X /> Cancel
          </Button>
        </div>
      </form>
    </Form>
  )

  return (
    <>
      <Tabs defaultValue="name" className="w-full">
        <TabsList>
          <TabsTrigger value="name">Name</TabsTrigger>
          <TabsTrigger value="member_id">Membership ID</TabsTrigger>
        </TabsList>
        <TabsContent value="name">{name_form}</TabsContent>
        <TabsContent value="member_id">{member_id_form}</TabsContent>
      </Tabs>
      <Toaster position="top-center" richColors />
    </>
  )
}
