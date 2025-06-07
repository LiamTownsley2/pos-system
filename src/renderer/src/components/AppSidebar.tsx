import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  Calendar,
  ChevronUp,
  Cog,
  Home,
  Inbox,
  LogOut,
  LucideArchive,
  PlusCircle,
  User2,
  User2Icon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { SearchForm } from './SearchForm'
import { HomeButton } from './HomeButton'
import { Button } from './ui/button'

const groups = [
  {
    label: 'Quick Access',
    children: [
      {
        title: 'Home',
        url: '/',
        icon: Home
      },
      {
        title: 'Inbox',
        url: '/inbox',
        icon: Inbox
      },
      {
        title: 'Calendar',
        url: '/calendar',
        icon: Calendar
      }
    ]
  },
  {
    label: 'Products',
    children: [
      {
        title: 'View All Products',
        url: '/products',
        icon: LucideArchive
      }
    ]
  }
]

const AppContent = (
  <SidebarContent>
    {groups.map((item, i) => (
      <SidebarGroup key={i}>
        <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {item.children.map((child) => (
              <SidebarMenuItem key={child.title}>
                <SidebarMenuButton asChild>
                  <a href={child.url}>
                    <child.icon />
                    <span>{child.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ))}
  </SidebarContent>
)

const AppSidebarFooter = (
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User2 /> Username
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <User2Icon />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cog />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: '#ff0000' }}>
              <LogOut color="#ff0000" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
)

export function AppSidebar(): React.JSX.Element {
  return (
    <Sidebar>
      <SidebarHeader>
        <HomeButton />
        <SearchForm />
        <Button variant={'outline'} className="mx-2 h-8">
          <PlusCircle /> Begin Transaction
        </Button>
      </SidebarHeader>
      {AppContent}
      {AppSidebarFooter}
    </Sidebar>
  )
}
