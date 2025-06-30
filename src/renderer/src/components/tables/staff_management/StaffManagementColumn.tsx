import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../../ui/button'
import { ArrowUpDown, Copy, DeleteIcon, Edit, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { Dialog, DialogTrigger } from '@renderer/components/ui/dialog'
import { StaffUser } from 'src/types/staff_users'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function getStaffManagementColumns(
  setDialog: (d: 'edit' | 'delete' | null) => void,
  setStaffMember: (d: StaffUser | null) => void
): ColumnDef<StaffUser>[] {
  return [
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Username
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('username')}</div>
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
    // {
    //   accessorKey: 'twofa_enabled',
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //       >
    //         Two Factor
    //         <ArrowUpDown />
    //       </Button>
    //     )
    //   },
    //   cell: ({ row }) => (
    //     <div className="capitalize flex flex-row gap-2">
    //       <span
    //         className="h-3 w-3 rounded-full block my-auto"
    //         style={{ backgroundColor: row.getValue('twofa_enabled') == 1 ? 'green' : 'red' }}
    //       />
    //       <div className="capitalize">
    //         {row.getValue('twofa_enabled') == 1 ? 'Enabled' : 'Disabled'}
    //       </div>
    //     </div>
    //   )
    // },
    {
      accessorKey: 'password_last_changed',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Password Last Changed
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const password_last_changed = row.getValue('password_last_changed')
        let timestamp: number =
          typeof password_last_changed === 'string'
            ? parseFloat(password_last_changed)
            : (password_last_changed as number)

        // Normalize timestamp to milliseconds
        if (timestamp < 1e12) {
          timestamp *= 1000
        }

        return <div>{dayjs(timestamp).fromNow()}</div>
      }
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created At
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const created_at = row.getValue('created_at')
        let timestamp: number =
          typeof created_at === 'string' ? parseFloat(created_at) : (created_at as number)

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
        const staff_member = row.original
        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff_member.id)}>
                  <Copy />
                  Copy Product ID
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => {
                      setDialog('edit')
                      setStaffMember(staff_member)
                    }}
                  >
                    <Edit />
                    Edit Product
                  </DropdownMenuItem>
                </DialogTrigger>
                {/* <EditProductDialog categories={categoryMap} product={product} /> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setDialog('delete')
                    setStaffMember(staff_member)
                  }}
                  className="text-red-500"
                >
                  <DeleteIcon className="text-red-500" />
                  Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        )
      }
    }
  ]
}
