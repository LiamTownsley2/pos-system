import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useOutletContext, useParams } from 'react-router-dom'
import { Textarea } from '@renderer/components/ui/textarea'
import { InboxMessage } from 'src/types/inbox_message'
import { StaffUser } from 'src/types/staff_users'

export default function InboxMessagePage(): React.JSX.Element {
  const [message, setMessage] = useState<InboxMessage>()
  const [author, setAuthor] = useState<StaffUser>()
  const context = useOutletContext<{ setRefresh: React.Dispatch<React.SetStateAction<number>> }>()
  const { message_id } = useParams()
  useEffect(() => {
    if (message_id) window.db.getInboxById(message_id).then(setMessage)
  }, [message_id])
  useEffect(() => {
    if (message) window.db.getStaffUserById(message.sender_id).then(setAuthor)
  }, [message])
  useEffect(() => {
    if (message) window.db.updateInbox(message?.id, { read_at: new Date().getTime() })
    context.setRefresh(Math.random())
  })
  return (
    <div className="p-6 max-w-4xl mx-auto h-auto flex flex-col">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-sm mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Inbox
      </button>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{message?.title}</CardTitle>
          <CardDescription>
            From: {author?.forename} {author?.surname}
            {message?.created_at && (
              <>
                {' · '}
                {new Date(message.created_at * 1000).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {' · '}
                {new Date(message.created_at * 1000).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between space-y-6">
          <div className="prose max-w-none text-sm overflow-y-auto">
            {message?.content?.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>

          <form className="pt-4 border-t flex flex-col gap-3">
            <Textarea placeholder="Write your reply..." className="min-h-[120px]" />
            <div className="flex justify-end">
              <Button type="submit">Send Reply</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
