import { GalleryVerticalEnd } from 'lucide-react'

import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import { Link } from 'react-router-dom'

export function HomeButton(): React.JSX.Element {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-app-version').then((version) => {
      setSelectedVersion(version)
    })
  }, [])

  return (
    <Link to={'/'}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Sellix System</span>
                {selectedVersion ? (
                  <span className="h-4">v{selectedVersion}</span>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </Link>
  )
}
