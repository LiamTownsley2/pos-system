import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { Button } from '../../ui/button'
import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { getCategoryColumn } from './CategoryColumn'
import { Category } from 'src/types/categories'
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
import ColourSelectorButton from '@renderer/components/ColourSelectorButton'
import { toast } from 'sonner'

export function CategoryTable({ categories }: { categories: Category[] }): React.JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [dialog, setDialog] = useState<null | 'edit' | 'delete'>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [editName, setEditName] = useState(category?.name || '')
  const [editColour, setEditColour] = useState(category?.colour || '')

  const columns = useMemo(() => getCategoryColumn(setDialog, setCategory), [])
  useEffect(() => {
    if (category) {
      setEditName(category.name)
      setEditColour(category.colour)
    }
  }, [category])

  const table = useReactTable({
    data: categories,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection
    }
  })

  const closeDialog = (): void => {
    setDialog(null)
    setCategory(null)
  }

  async function handleEditSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!category) return

    const updatedCategory = {
      ...category,
      name: editName,
      colour: editColour
    }

    try {
      await window.db.updateCategory(category.id, updatedCategory) // example API call
      setDialog(null)
      setCategory(null)
      window.location.reload()
      // Optionally refresh inventory data here or update state
    } catch (error) {
      console.error('Failed to update product', error)
      toast.error('Failed tto update category.')
      // Show error toast/message
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
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
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Make changes and click save.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />

              <Label htmlFor="unit">Colour: {editColour}</Label>
              <ColourSelectorButton
                value={editColour}
                onChange={(e) => setEditColour(e.toString())}
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
              <code className="font-bold">{category?.name}</code>&quot; product and its data from
              the system.
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
                if (category?.id) {
                  window.db.deleteCategory(category?.id)
                }
                window.location.reload()
              }}
            >
              Yes, I&apos;m sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
