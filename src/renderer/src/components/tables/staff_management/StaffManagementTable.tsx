import React, { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import { Button } from '../../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { getStaffManagementColumns } from './StaffManagementColumn'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'

import { Label } from '@renderer/components/ui/label'
import { Input } from '@renderer/components/ui/input'
import { StaffUser } from 'src/types/staff_users'

export function StaffManagementTable({
  staff_members
}: {
  staff_members: StaffUser[]
}): React.JSX.Element {
  const [dialog, setDialog] = useState<null | 'edit' | 'delete'>(null)
  const [staffMember, setStaffMember] = useState<StaffUser | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [editUsername, setUsername] = useState(staffMember?.username || '')
  // const [editForename, setForename] = useState(staffMember?.forename || '')
  // const [editSurname, setSurname] = useState(staffMember?.surname || 0)
  // const [editPassword, setEditPassword] = useState('')
  // const [editForcePasswordChange, setForcePasswordChange] = useState(
  //   staffMember?.must_reset_password || ''
  // )

  useEffect(() => {
    if (staffMember) {
      // setEditName(staffMember.name)
      // setEditPrice(staffMember.price_per_unit)
      // setEditUnit(staffMember.unit)
      // setEditCategory(staffMember.category)
    }
  }, [staffMember])

  const columns = useMemo(() => getStaffManagementColumns(setDialog, setStaffMember), [])

  const table = useReactTable({
    data: staff_members,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  // Dialog close handler
  const closeDialog = (): void => {
    setDialog(null)
    setStaffMember(null)
  }

  async function handleEditSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!staffMember) return

    // const updatedStaffMember = {
    //   ...staffMember,
    //   name: editName,
    //   price_per_unit: editPrice,
    //   unit: editUnit,
    //   category: editCategory
    // }

    try {
      // await window.db.updateProduct(staffMember.id, updatedStaffMember) // example API call
      setDialog(null)
      setStaffMember(null)
      window.location.reload()
      // Optionally refresh inventory data here or update state
    } catch (error) {
      console.error('Failed to update Staff Member Profile', error)
      // Show error toast/message
    }
  }

  return (
    <>
      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialog === 'edit'} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Make changes and click save.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editUsername}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" className="grow">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialog === 'delete'} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the &quot;
              <code className="font-bold">
                {staffMember?.forename} {staffMember?.surname}
              </code>
              &quot; product and its data from the system.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="grow">
                No, go back!
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                closeDialog()
                if (staffMember?.id) window.db.deleteProduct(staffMember?.id)
                window.location.reload()
              }}
            >
              Yes, I&apos;m sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
