import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardTitle } from '@renderer/components/ui/card'
import { Label } from '@renderer/components/ui/label'
import { Separator } from '@renderer/components/ui/separator'
import { SidebarInput } from '@renderer/components/ui/sidebar'
import { Fingerprint, Mail, Search, ShoppingBasket, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Member } from 'src/types/member'
import { UserAllotmentsLink } from 'src/types/user_allotments'

export default function ResumeTransaction(): React.JSX.Element {
  const [members, setMembers] = useState<Member[] | null>(null)
  const [gardenLinks, setGardenLinks] = useState<UserAllotmentsLink[] | null>(null)
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const filteredMembers = useMemo(() => {
    return members?.filter((member) => {
      const gardenNumber = gardenLinks?.find((link) => link.member_id === member.id)?.id
      const query = search.toLowerCase()
      return (
        member.forename.toLowerCase().includes(query) ||
        member.surname.toLowerCase().includes(query) ||
        `${member.forename} ${member.surname}`.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query) ||
        member.short_id.toLowerCase().includes(query) ||
        gardenNumber?.toString().includes(query)
      )
    })
  }, [search, members, gardenLinks])

  useEffect(() => {
    async function fetchMembers(): Promise<void> {
      const _members = await window.db.getAllMembers()
      setMembers(_members)
    }
    async function fetchGardenLinks(): Promise<void> {
      const _links = await window.db.getAllAllotmentLinks()
      setGardenLinks(_links)
    }
    fetchMembers()
    fetchGardenLinks()
  }, [])

  return (
    <div className="flex w-full">
      <div className="p-2 mt-4 w-full flex-1 flex flex-col items-center justify-center">
        <Card className="w-full">
          <CardTitle className="text-center mx-8">
            <h1 className="text-5xl font-semibold my-8">Resume Held Transaction</h1>
            <Separator />
          </CardTitle>
          {/* <Link to={'/select-member/pos'} className="mx-2 h-8">
          <Button variant={'outline'} className="h-8 w-full">
            <PlusCircle /> Begin Transaction
          </Button>
        </Link> */}
          <CardContent>
            <div className="w-full px-20">
              <div className="flex flex-col relative mx-40 mb-8">
                <div className="relative mx-20 mb-4">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <SidebarInput
                    id="search"
                    placeholder="Search Member by Name or Garden Number..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </div>
                {selectedMember && (
                  <Button
                    className="mx-20 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      window.location.hash = `#/pos/${selectedMember.short_id}`
                    }}
                  >
                    <ShoppingBasket /> Continue Selection for: {selectedMember.title}.{' '}
                    {selectedMember.forename} {selectedMember.surname}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-10 w-full px-20">
                {filteredMembers?.map((_member, i) => {
                  const _links = gardenLinks?.filter((link) => link.member_id == _member.id)
                  const additional_styling =
                    _member.id == selectedMember?.id ? 'border-blue-300' : ''
                  return (
                    <Card
                      key={i}
                      className={`w-full hover:bg-accent select-none ${additional_styling}`}
                      onClick={() => {
                        setSelectedMember(_member)
                      }}
                    >
                      <CardContent>
                        <p className="flex flex-row gap-2">
                          <User /> {_member.title}. {_member.forename} {_member.surname}
                        </p>
                        <p className="flex flex-row gap-2">
                          <Mail />
                          {_member.email}
                        </p>
                        <p className="flex flex-row gap-2">
                          <Fingerprint /> {_member.short_id}
                        </p>
                        {_links?.length ? (
                          <div className="mt-2">
                            <p className="font-medium">Linked Gardens:</p>
                            <ul className="list-disc list-inside">
                              {_links.map((link) => (
                                <li key={link.id}>{link.id}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-muted-foreground mt-2">No linked gardens.</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
