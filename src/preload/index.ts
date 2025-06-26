import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('db', {
      // Members
      createMember: (member: Partial<Omit<Member, 'id' | 'registered_at'>>) =>
        ipcRenderer.invoke('db:createMember', member),
      getMemberById: (id: string) => ipcRenderer.invoke('db:getMemberById', id),
      getAllMembers: () => ipcRenderer.invoke('db:getAllMembers'),
      updateMember: (id: string, updates: Partial<Omit<Member, 'id' | 'registered_at'>>) =>
        ipcRenderer.invoke('db:updateMember', id, updates),
      deleteMember: (id: string) => ipcRenderer.invoke('db:deleteMember', id)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
