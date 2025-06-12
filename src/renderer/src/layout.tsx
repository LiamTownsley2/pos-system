import { useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSidebar'
import { Separator } from './components/ui/separator'
import AppBreadcrumb from './components/AppBreadcrumb'
import { Clock } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour12: false })
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full m-4">
        <div className="flex h-5 items-center space-x-4 text-sm">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <AppBreadcrumb />
          <div className="ml-auto flex gap-2 items-center">
            <Clock className="h-4" />
            <p>{currentTime}</p>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
