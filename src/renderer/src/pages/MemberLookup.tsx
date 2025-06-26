import { LookupForm } from '@renderer/components/LookupForm'
import { MembershipTable } from '@renderer/components/MembershipTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Separator } from '@renderer/components/ui/separator'

import React, { useEffect, useState } from 'react'
import { Member } from 'src/types/member'

export default function MemberLookup(): React.JSX.Element {
  const [members, setMembers] = useState<Member[]>([])
  const [searchData, setSearchData] = useState<
    | { type: 'name'; forename: string; surname: string }
    | { type: 'id'; member_id: string }
    | undefined
  >(undefined)

  useEffect(() => {
    window.db.getAllMembers().then((data: Member[]) => {
      setMembers(
        data.filter((member) => {
          if (searchData?.type === 'id') {
            if (searchData.member_id == '') return true
            return member.id == searchData.member_id
          }
          if (searchData?.type === 'name') {
            const forename = member.forename?.toLowerCase() || ''
            const surname = member.surname?.toLowerCase() || ''
            if (forename == '' && surname == '') return true
            const searchForename = searchData.forename.toLowerCase()
            const searchSurname = searchData.surname.toLowerCase()
            return (
              (searchForename && forename.includes(searchForename)) ||
              (searchSurname && surname.includes(searchSurname))
            )
          }
          return true
        })
      )
    })
  }, [searchData])

  return (
    <div>
      <div className="text-center my-4">
        <h1 className="text-3xl font-bold">Membership Management</h1>
        <h2 className="text-2xl">Lookup</h2>
      </div>
      <Separator />
      <div className="flex w-full">
        <Card className="p-2 mt-4 grow">
          <CardHeader className="mt-4">
            <CardTitle>Membership Lookup</CardTitle>
            <CardDescription>
              This form can be used for searching for an existing member! To create a new member{' '}
              <a href={'#/register-member'} className="underline">
                click here
              </a>{' '}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <LookupForm setSearchData={setSearchData} />
          </CardContent>
        </Card>
      </div>
      <br />
      <MembershipTable members={members} />
    </div>
  )
}
