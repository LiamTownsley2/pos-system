import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSidebar'
import { Separator } from './components/ui/separator'
import AppBreadcrumb from './components/AppBreadcrumb'
import { Clock, LockKeyhole } from 'lucide-react'
import { Button } from './components/ui/button'
import { useAuth } from './components/AuthContext'

export default function Layout(): React.JSX.Element {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour12: false })
  })
  const [refresh, setRefresh] = useState(0)
  const { logout } = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar refresh={refresh} />
      <main className="flex-1 w-full m-4">
        <div className="flex h-5 items-center space-x-4 text-sm">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <AppBreadcrumb />
          <div className="ml-auto flex flex-row">
            <Button variant={'ghost'} onClick={logout}>
              <LockKeyhole /> Lock System
            </Button>
            <div className="flex items-center">
              <Separator orientation="vertical" className="mx-2" />
              <Clock className="h-4" />
              <p>{currentTime}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Outlet context={{ setRefresh }} />
        </div>
      </main>
    </SidebarProvider>
  )
}
