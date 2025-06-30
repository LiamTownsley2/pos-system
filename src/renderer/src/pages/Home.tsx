import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import { useEffect, useState } from 'react'
import { Member } from '../../../types/member'

export default function Home(): React.JSX.Element {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchUnsynced(): Promise<void> {
      try {
        const data = await window.db.getAllMembers()
        if (mounted && Array.isArray(data)) {
          setMembers(data)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchUnsynced()
    return () => {
      mounted = false
    }
  }, [members])

  return (
    <div className="flex w-full">
      <Card className="p-2 mt-4 grow">
        <Button
          onClick={async () => {
            const _member = await window.db.createMember({
              forename: 'Test',
              surname: 'user',
              email: 'testuser@test.com',
              phone: '07707129263',
              title: 'Dr'
            })
            alert(
              [`ID: ${_member.id}`, `Email: ${_member.email}`, `Name: ${_member.forename}`].join(
                '\n'
              )
            )
          }}
        >
          Add Test Post
        </Button>
        <Button
          onClick={async () => {
            await window.db.createBalanceMovement({
              member_id: '0197ad9f-9392-73e4-acfb-4f53490673d3',
              amount: 15,
              type: 'in'
            })
            alert([`Added balance`].join('\n'))
          }}
        >
          Add Test Balance
        </Button>
        <Button
          onClick={async () => {
            alert(
              JSON.stringify(
                await window.db.createStockMovement({
                  product_id: '0197bda3-2cf5-7059-ad8a-8ec0b6c62981',
                  quantity: 25,
                  type: 'in'
                })
              )
            )
          }}
        >
          Create Test stock movement
        </Button>
        <div className="mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            <ul>
              {members.map((member) => (
                <li key={member.id} className="mb-2">
                  <strong>{member.id}:</strong> {member.forename}
                  This post has {member.phone ? 'a' : 'no'} phone number.
                  <Button
                    onClick={async () => {
                      alert(JSON.stringify(await window.db.getMemberById(member.id)))
                    }}
                  >
                    Get Member
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  )
}
