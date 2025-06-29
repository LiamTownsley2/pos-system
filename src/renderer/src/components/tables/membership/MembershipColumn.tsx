import { ColumnDef } from '@tanstack/react-table'
import { Member } from 'src/types/member'
import { Button } from '../../ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export const membership_column: ColumnDef<Member>[] = [
  {
    accessorKey: 'short_id',
    header: 'ID',
    cell: ({ row }) => <div className="capitalize">{row.getValue('short_id')}</div>
  },
  {
    accessorKey: 'forename',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Forename
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('forename')}</div>
  },
  {
    accessorKey: 'surname',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Surname
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('surname')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
    cell: ({ row }) => <div className="lowercase">{row.getValue('phone')}</div>
  },
  {
    accessorKey: 'registered_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registered At
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      dayjs.extend(relativeTime)

      const registered_at = row.getValue('registered_at')
      let timestamp: number =
        typeof registered_at === 'string' ? parseFloat(registered_at) : (registered_at as number)

      // Normalize timestamp to milliseconds
      if (timestamp < 1e12) {
        timestamp *= 1000
      }

      return <div>{dayjs(timestamp).fromNow()}</div>
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.short_id)}>
              Copy Membership ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.email)}>
              Copy Email
            </DropdownMenuItem>
            {member.phone && (
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.phone!)}>
                Copy Phone Number
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.hash = `#/member/${member.short_id}`)}
            >
              View customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
