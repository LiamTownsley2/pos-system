import { RegisterMemberForm } from '@renderer/components/RegisterMemberForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Separator } from '@renderer/components/ui/separator'

export default function RegisterMember(): React.JSX.Element {
  return (
    <div>
      <div className="text-center my-4">
        <h1 className="text-3xl font-bold">Membership Management</h1>
        <h2 className="text-2xl">Registration</h2>
      </div>
      <Separator />
      <div className="flex w-full">
        <Card className="p-2 mt-4 grow">
          <CardHeader className="mt-4">
            <CardTitle>Register New Member</CardTitle>
            <CardDescription>
              This form can be used for registring a new member to a garden! To lookup an existing
              member{' '}
              <a href={'#/member-lookup'} className="underline">
                click here
              </a>
              .
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <RegisterMemberForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
