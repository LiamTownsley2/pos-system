import { ElectronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'

declare global {
  // type Post = { id: string; content: string; synced: number }
  interface Window {
    electron: ElectronAPI
    api: unknown
    db: {
      // Members
      createMember: (member: Partial<Omit<Member, 'id' | 'registered_at'>>) => Promise<Member>
      getMemberById: (id: string) => Promise<Member>
      getAllMembers: () => Promise<Member[]>
      updateMember: (
        id: string,
        updates: Partial<Omit<Member, 'id' | 'registered_at'>>
      ) => Promise<Member>
      deleteMember: (id: string) => Promise<boolean>

      // Categories
      createCategory: (category: Partial<Omit<Category, 'id'>>) => Promise<Category>
      getCategoryById: (id: string) => Promise<Category>
      getCategoryByName: (name: string) => Promise<Category>
      getAllCategories: () => Promise<Category[]>
      updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => Promise<Category>
      deleteCategory: (id: string) => Promise<boolean>
    }
  }
}
