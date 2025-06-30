import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'
import { Category } from '../types/categories'
import { Product } from '../types/product'
import { StockMovement } from '../types/stock_movement'
import { UserAllotmentsLink } from '../types/user_allotments'
import { BalanceMovement } from '../types/balance_movement'
import { Receipt, ReceiptItem } from '../types/receipts'
import { InboxMessage } from '../types/inbox_message'
import { StaffUser } from '../types/staff_users'

const database = {
  login: (username: string, password: string) =>
    ipcRenderer.invoke('auth:login', username, password),
  getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),

  encryptPassword: (password: string) => ipcRenderer.invoke('encrypt-password', password),
  // Members
  createMember: (member: Omit<Member, 'id' | 'registered_at' | 'short_id' | 'balance'>) =>
    ipcRenderer.invoke('db:createMember', member),
  getMemberById: (id: string) => ipcRenderer.invoke('db:getMemberById', id),
  getAllMembers: () => ipcRenderer.invoke('db:getAllMembers'),
  updateMember: (id: string, updates: Partial<Omit<Member, 'id' | 'registered_at'>>) =>
    ipcRenderer.invoke('db:updateMember', id, updates),
  deleteMember: (id: string) => ipcRenderer.invoke('db:deleteMember', id),

  // Categories
  createCategory: (category: Omit<Category, 'id'>) =>
    ipcRenderer.invoke('db:createCategory', category),
  getCategoryById: (id: string) => ipcRenderer.invoke('db:getCategoryById', id),
  getCategoryByName: (name: string) => ipcRenderer.invoke('db:getCategoryByName', name),
  getAllCategories: () => ipcRenderer.invoke('db:getAllCategories'),
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) =>
    ipcRenderer.invoke('db:updateCategory', id, updates),
  deleteCategory: (id: string) => ipcRenderer.invoke('db:deleteCategory', id),

  // Products
  createProduct: (product: Omit<Product, 'id'>) => ipcRenderer.invoke('db:createProduct', product),
  getProductById: (id: string) => ipcRenderer.invoke('db:getProductById', id),
  getProductByName: (name: string) => ipcRenderer.invoke('db:getProductByName', name),
  getAllProducts: () => ipcRenderer.invoke('db:getAllProducts'),
  getProductByCategory: (category: string) =>
    ipcRenderer.invoke('db:getProductByCategory', category),
  updateProduct: (id: string, updates: Product) =>
    ipcRenderer.invoke('db:updateProduct', id, updates),
  deleteProduct: (id: string) => ipcRenderer.invoke('db:deleteProduct', id),

  // Stock Movement
  createStockMovement: (stock_movement: Omit<StockMovement, 'id' | 'created_at'>) =>
    ipcRenderer.invoke('db:createStockMovement', stock_movement),
  getStockMovementById: (id: string) => ipcRenderer.invoke('db:getStockMovementById', id),
  getAllStockMovements: () => ipcRenderer.invoke('db:getAllStockMovement'),

  // Allotment Link
  createAllotmentLink: (alllotment_link: Omit<UserAllotmentsLink, 'created_at'>) =>
    ipcRenderer.invoke('db:createAllotmentLink', alllotment_link),
  getAllotmentLinkByGardenId: (id: string) =>
    ipcRenderer.invoke('db:getAllotmentLinkByGardenId', id),
  getAllotmentLinkByMemberId: (member_id: string) =>
    ipcRenderer.invoke('db:getAllotmentLinkByMemberId', member_id),
  getAllAllotmentLinks: () => ipcRenderer.invoke('db:getAllAllotmentLinks'),
  updateAllotmentLink: (id: string, updates: Omit<UserAllotmentsLink, 'created_at'>) =>
    ipcRenderer.invoke('db:updateAllotmentLink', id, updates),
  deleteAllotmentLink: (id: string) => ipcRenderer.invoke('db:deleteAllotmentLink', id),

  // Balance Movement
  createBalanceMovement: (balance_movement: Omit<BalanceMovement, 'id' | 'created_at'>) =>
    ipcRenderer.invoke('db:createBalanceMovement', balance_movement),
  getBalanceMovementById: (id: string) => ipcRenderer.invoke('db:getBalanceMovementById', id),
  getAllBalanceMovements: () => ipcRenderer.invoke('db:getAllBalanceMovements'),

  // Receipts
  createReceipt: (receipt: Omit<Receipt, 'id' | 'created_at'>) =>
    ipcRenderer.invoke('db:createReceipt', receipt),
  getReceiptById: (id: string) => ipcRenderer.invoke('db:getReceiptById', id),
  getAllReceipts: () => ipcRenderer.invoke('db:getAllReceipts'),
  updateReceipt: (id: string, updates: Partial<Omit<Receipt, 'id'>>) =>
    ipcRenderer.invoke('db:updateReceipt', id, updates),
  deleteReceipt: (id: string) => ipcRenderer.invoke('db:deleteReceipt', id),

  // Receipt Items
  createReceiptItem: (item: Omit<ReceiptItem, 'id'>) =>
    ipcRenderer.invoke('db:createReceiptItem', item),
  getReceiptItemById: (id: string) => ipcRenderer.invoke('db:getReceiptItemById', id),
  getReceiptItemsByReceiptId: (receipt_id: string) =>
    ipcRenderer.invoke('db:getReceiptItemsByReceiptId', receipt_id),
  updateReceiptItem: (id: string, updates: Partial<Omit<ReceiptItem, 'id' | 'receipt_id'>>) =>
    ipcRenderer.invoke('db:updateReceiptItem', id, updates),
  deleteReceiptItem: (id: string) => ipcRenderer.invoke('db:deleteReceiptItem', id),

  // Inbox
  createInbox: (inbox: Omit<InboxMessage, 'id' | 'created_at' | 'is_deleted'>) =>
    ipcRenderer.invoke('db:createInbox', inbox),
  getInboxById: (id: string) => ipcRenderer.invoke('db:getInboxById', id),
  getInboxByRecipientId: (id: string) => ipcRenderer.invoke('db:getInboxByRecipientId', id),
  getAllInboxes: () => ipcRenderer.invoke('db:getAllInboxes'),
  updateInbox: (id: string, updates: Partial<Omit<InboxMessage, 'id' | 'created_at'>>) =>
    ipcRenderer.invoke('db:updateInbox', id, updates),
  softDeleteInbox: (id: string) => ipcRenderer.invoke('db:softDeleteInbox', id),
  hardDeleteInbox: (id: string) => ipcRenderer.invoke('db:hardDeleteInbox', id),

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
  ) => ipcRenderer.invoke('db:createStaffUser', user),
  getStaffUserById: (id: string) => ipcRenderer.invoke('db:getStaffUserById', id),
  getStaffUserByUsername: (username: string) =>
    ipcRenderer.invoke('db:getStaffUserByUsername', username),
  listStaffUsers: () => ipcRenderer.invoke('db:listStaffUsers'),
  updateStaffUser: (id: string, updates: Partial<Omit<StaffUser, 'id' | 'created_at'>>) =>
    ipcRenderer.invoke('db:updateStaffUser', id, updates),
  deleteStaffUser: (id: string) => ipcRenderer.invoke('db:deleteStaffUser', id)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', {})
    contextBridge.exposeInMainWorld('db', database)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = {}
}
