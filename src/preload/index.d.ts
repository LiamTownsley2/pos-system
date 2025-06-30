import { ElectronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'
import { Category } from '../types/category'
import { Product } from '../types/product'
import { StockMovement } from 'src/types/stock_movement'
import { UserAllotmentsLink } from 'src/types/user_allotments'
import { BalanceMovement } from 'src/types/balance_movement'
import { Receipt, ReceiptItem } from 'src/types/receipts'
import { InboxMessage } from 'src/types/inbox_message'
import { StaffUser } from 'src/types/staff_users'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    db: {
      login: (username: string, password: string) => Promise<{ success: boolean }>
      getCurrentUser: () => Promise<null | Omit<
        StaffUser,
        'password_hash' | 'twofa_backup_codes' | 'twofa_secret'
      >>
      encryptPassword: (password: string) => Promise<string>

      // Members
      createMember: (
        member: Omit<Member, 'id' | 'registered_at' | 'short_id' | 'balance'>
      ) => Promise<Member>
      getMemberById: (id: string) => Promise<Member>
      getAllMembers: () => Promise<Member[]>
      updateMember: (
        id: string,
        updates: Partial<Omit<Member, 'id' | 'registered_at'>>
      ) => Promise<Member>
      deleteMember: (id: string) => Promise<boolean>

      // Categories
      createCategory: (category: Omit<Category, 'id'>) => Promise<Category>
      getCategoryById: (id: string) => Promise<Category>
      getCategoryByName: (name: string) => Promise<Category>
      getAllCategories: () => Promise<Category[]>
      updateCategory: (id: string, updates: Omit<Category, 'id'>) => Promise<Category>
      deleteCategory: (id: string) => Promise<boolean>

      // Products
      createProduct: (product: Omit<Product, 'id' | 'quantity'>) => Promise<Product>
      getProductById: (id: string) => Promise<Product>
      getProductByName: (name: string) => Promise<Product>
      getAllProducts: () => Promise<Product[]>
      getProductByCategory: (category: string) => Promise<Product[]>
      updateProduct: (id: string, updates: Omit<Product, 'id' | 'quantity'>) => Promise<Product>
      deleteProduct: (id: string) => Promise<boolean>

      // Stock Movement
      createStockMovement: (
        stock_movement: Omit<StockMovement, 'id' | 'created_at'>
      ) => Promise<StockMovement>
      getStockMovementById: (id: string) => Promise<StockMovement>
      getAllStockMovements: () => Promise<StockMovement[]>

      // Allotment Link
      createAllotmentLink: (
        alllotment_link: Omit<UserAllotmentsLink, 'created_at'>
      ) => Promise<UserAllotmentsLink>
      getAllotmentLinkByGardenId: (id: string) => Promise<UserAllotmentsLink>
      getAllotmentLinkByMemberId: (member_id: string) => Promise<UserAllotmentsLink>
      getAllAllotmentLinks: () => Promise<UserAllotmentsLink[]>
      updateAllotmentLink: (
        id: string,
        updates: Omit<UserAllotmentsLink, 'created_at'>
      ) => Promise<UserAllotmentsLink>
      deleteAllotmentLink: (id: string) => Promise<boolean>

      // Balance Movement
      createBalanceMovement: (
        balance_movement: Omit<BalanceMovement, 'id' | 'created_at'>
      ) => Promise<BalanceMovement>
      getBalanceMovementById: (id: string) => Promise<BalanceMovement>
      getAllBalanceMovements: () => Promise<boolean>

      // Receipts
      createReceipt: (receipt: Omit<Receipt, 'id' | 'created_at'>) => Promise<Receipt>
      getReceiptById: (id: string) => Promise<Receipt | undefined>
      getAllReceipts: () => Promise<Receipt[]>
      updateReceipt: (
        id: string,
        updates: Partial<Omit<Receipt, 'id'>>
      ) => Promise<Receipt | undefined>
      deleteReceipt: (id: string) => Promise<boolean>

      // Receipt Items
      createReceiptItem: (item: Omit<ReceiptItem, 'id'>) => Promise<ReceiptItem>
      getReceiptItemById: (id: string) => Promise<ReceiptItem | undefined>
      getReceiptItemsByReceiptId: (receipt_id: string) => Promise<ReceiptItem[]>
      updateReceiptItem: (
        id: string,
        updates: Partial<Omit<ReceiptItem, 'id' | 'receipt_id'>>
      ) => Promise<ReceiptItem | undefined>
      deleteReceiptItem: (id: string) => Promise<boolean>

      // Inbox
      createInbox: (
        inbox: Omit<InboxMessage, 'id' | 'created_at' | 'is_deleted'>
      ) => Promise<InboxMessage>
      getInboxById: (id: string) => Promise<InboxMessage>
      getInboxByRecipientId: (id: string) => Promise<InboxMessage[]>
      getAllInboxes: () => Promise<InboxMessage[]>
      updateInbox: (
        id: string,
        updates: Partial<Omit<InboxMessage, 'id' | 'created_at'>>
      ) => Promise<InboxMessage>
      softDeleteInbox: (id: string) => Promise<boolean>
      hardDeleteInbox: (id: string) => Promise<boolean>

      // Staff Management
      createStaffUser: (
        user: Omit<
          StaffUser,
          | 'id'
          | 'created_at'
          | 'must_reset_password'
          | 'twofa_enabled'
          | 'twofa_secret'
          | 'twofa_backup_codes'
          | 'password_last_changed'
        >
      ) => Promise<StaffUser>
      getStaffUserById: (id: string) => Promise<StaffUser>
      getStaffUserByUsername: (username: string) => Promise<StaffUser>
      listStaffUsers: () => Promise<StaffUser[]>
      updateStaffUser: (
        id: string,
        updates: Partial<Omit<StaffUser, 'id' | 'created_at'>>
      ) => Promise<StaffUser>
      deleteStaffUser: (id: string) => Promise<boolean>
    }
  }
}
