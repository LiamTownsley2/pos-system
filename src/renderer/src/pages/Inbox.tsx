import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@renderer/components/AuthContext'
import { SendMessageDialog } from '@renderer/dialog/SendMessageDialog'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Mail, MailPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { InboxMessage } from 'src/types/inbox_message'
dayjs.extend(relativeTime)

export default function InboxPage(): React.JSX.Element {
  const { user } = useAuth()
  const [messages, setMessages] = useState<InboxMessage[]>([])
  useEffect(() => {
    if (user) window.db.getInboxByRecipientId(user.id).then(setMessages)
  }, [user])
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-row">
        <h2 className="text-xl font-semibold mb-4 grow-1">Inbox</h2>
        {/* <Button>
          <Mail /> Send New Message
        </Button> */}
        <SendMessageDialog />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)] space-y-2">
        {messages && messages.length > 0 ? (
          messages
            .sort((a, b) => b.created_at - a.created_at)
            .filter((msg) => msg.is_deleted == 0)
            .map((msg) => {
              let timestamp = msg.created_at
              if (timestamp < 1e12) timestamp *= 1000

              return (
                <Card
                  key={msg.id}
                  onClick={() => (window.location.hash = `#/inbox/${msg.id}`)}
                  className="p-4 cursor-pointer hover:bg-muted transition my-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium flex flex-row gap-4">
                      {msg.read_at == null ? <MailPlus className="text-green-600" /> : <Mail />}
                      {msg.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {dayjs(timestamp).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {msg.sender_id} —{' '}
                    {msg.content.length > 100 ? msg.content.slice(0, 100) + '…' : msg.content}
                  </p>
                </Card>
              )
            })
        ) : (
          <p>You have no mail!</p>
        )}
      </ScrollArea>
    </div>
  )
}
