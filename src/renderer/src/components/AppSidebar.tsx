import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
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
import { HomeButton } from './HomeButton'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { StaffUser } from 'src/types/staff_users'
import { useEffect, useState } from 'react'

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
        title: 'Audit Logs',
        url: '#/audit-logs',
        icon: ClipboardList
      },
      {
        title: 'System Settings',
        url: '#/settings',
        icon: Settings
      }
    ]
  }
]

function AppContent({ user_id, refresh }: { user_id: string; refresh: number }): React.JSX.Element {
  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    window.db.getInboxByRecipientId(user_id).then((inbox) => {
      const count = inbox.filter((msg) => msg.read_at == null).length
      setUnreadCount(count || 0)
    })
  }, [user_id, refresh])

  return (
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
                  {child.title == 'Inbox' && unreadCount > 0 && (
                    <SidebarMenuBadge className="bg-red-400 text-white">
                      {unreadCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}

const AppSidebarFooter = (
  user: Omit<StaffUser, 'password_hash' | 'twofa_backup_codes' | 'twofa_secret'>
): React.JSX.Element => {
  const { logout } = useAuth()
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {user.forename} {user.surname} ({user.username})
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
                <span>My Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: '#ff0000' }} onClick={logout}>
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

export function AppSidebar({ refresh }: { refresh: number }): React.JSX.Element {
  const { user } = useAuth()
  return (
    <Sidebar>
      <SidebarHeader>
        <HomeButton />
        <Link to={'/pos'} className="mx-2 h-8">
          <Button variant={'outline'} className="h-8 w-full">
            <PlusCircle /> Begin Transaction
          </Button>
        </Link>
      </SidebarHeader>
      {user && AppContent({ user_id: user.id, refresh })}
      {user && AppSidebarFooter(user)}
    </Sidebar>
  )
}
