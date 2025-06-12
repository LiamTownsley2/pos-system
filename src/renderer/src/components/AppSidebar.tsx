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
  Boxes,
  Calendar,
  ChevronUp,
  ClipboardList,
  Cog,
  FileBarChart,
  Home,
  Inbox,
  LogOut,
  Percent,
  PlusCircle,
  Search,
  Settings,
  User2,
  User2Icon,
  UserPlus,
  Users
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
import { Link } from 'react-router-dom'

const groups = [
  {
    label: 'Quick Access',
    children: [
      {
        title: 'Home',
        url: '#',
        icon: Home
      },
      {
        title: 'Inbox',
        url: '#/inbox',
        icon: Inbox
      },
      {
        title: 'Calendar',
        url: '#/calendar',
        icon: Calendar
      }
    ]
  },
  {
    label: 'Member Management',
    children: [
      {
        title: 'Register Member',
        url: '#/register-member',
        icon: UserPlus
      },
      {
        title: 'Member Lookup',
        url: '#/member-lookup',
        icon: Search
      }
    ]
  },
  {
    label: 'Management',
    children: [
      {
        title: 'Inventory',
        url: '#/inventory',
        icon: Boxes
      },
      {
        title: 'Manage Staff',
        url: '#/staff-management',
        icon: Users
      },
      {
        title: 'Sales Reports',
        url: '#/sales-reports',
        icon: FileBarChart
      },
      {
        title: 'Promotions',
        url: '#/promotions',
        icon: Percent
      },
      {
        title: 'Audit Logs',
        url: '#/audit-logs',
        icon: ClipboardList
      },
      {
        title: 'Settings',
        url: '#/settings',
        icon: Settings
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

const AppSidebarFooter = (username: string): React.JSX.Element => {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {username}
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
}

export function AppSidebar({ username }: { username: string }): React.JSX.Element {
  return (
    <Sidebar>
      <SidebarHeader>
        <HomeButton />
        <SearchForm />
        <Link to={'/pos'} className="mx-2 h-8">
          <Button variant={'outline'} className="h-8 w-full">
            <PlusCircle /> Begin Transaction
          </Button>
        </Link>
      </SidebarHeader>
      {AppContent}
      {AppSidebarFooter(username)}
    </Sidebar>
  )
}
