export type InboxMessage = {
  id: string
  recipient_id: string
  sender_id: string
  title: string
  content: string
  is_deleted: 1 | 0
  read_at: number | null
  created_at: number
}
