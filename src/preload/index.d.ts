import { ElectronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'

declare global {
  type Post = { id: string; content: string; synced: number }
  interface Window {
    electron: ElectronAPI
    api: unknown
    db: {
      insertPost: (id: string, content: string) => Promise<void>
      getAll: () => Promise<Post[]>
      getUnsynced: () => Promise<Post[]>
      markSynced: (id: string) => Promise<void>

      // Members
      createMember: (member: Partial<Omit<Member, 'id' | 'registered_at'>>) => Promise<Member>
      getMemberById: (id: string) => Promise<Member>
      getAllMembers: () => Promise<Member[]>
      updateMember: (
        id: string,
        updates: Partial<Omit<Member, 'id' | 'registered_at'>>
      ) => Promise<Member>
      deleteMember: (id: string) => Promise<boolean>
    }
  }
}
