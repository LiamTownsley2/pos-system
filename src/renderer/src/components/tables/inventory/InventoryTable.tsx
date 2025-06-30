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
import { getInventoryColumns } from './InventoryColumn'
import { Product } from 'src/types/product'
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

export function InventoryTable({ inventory }: { inventory: Product[] }): React.JSX.Element {
  const [categoryMap, setCategoryMap] = useState<Category[]>([])
  const [dialog, setDialog] = useState<null | 'edit' | 'delete'>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [editName, setEditName] = useState(product?.name || '')
  const [editPrice, setEditPrice] = useState(product?.price_per_unit || 0)
  const [editUnit, setEditUnit] = useState(product?.unit || '')
  const [editCategory, setEditCategory] = useState(product?.category || '')

  useEffect(() => {
    window.db.getAllCategories().then(setCategoryMap)
  }, [])

  useEffect(() => {
    if (product) {
      setEditName(product.name)
      setEditPrice(product.price_per_unit)
      setEditUnit(product.unit)
      setEditCategory(product.category)
    }
  }, [product])

  const columns = useMemo(
    () => getInventoryColumns(categoryMap, setDialog, setProduct),
    [categoryMap]
  )

  const table = useReactTable({
    data: inventory,
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
    setProduct(null)
  }

  async function handleEditSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!product) return

    const updatedProduct = {
      ...product,
      name: editName,
      price_per_unit: editPrice,
      unit: editUnit,
      category: editCategory
    }

    try {
      await window.db.updateProduct(product.id, updatedProduct) // example API call
      setDialog(null)
      setProduct(null)
      window.location.reload()
      // Optionally refresh inventory data here or update state
    } catch (error) {
      console.error('Failed to update product', error)
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />

              <Label htmlFor="price">Price per Unit</Label>
              <Input
                id="price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
              />

              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" value={editUnit} onChange={(e) => setEditUnit(e.target.value)} />

              <Label htmlFor="category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryMap.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span
                        className="h-3 w-3 rounded-full inline-block mr-2"
                        style={{ backgroundColor: c.colour }}
                      />
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <code className="font-bold">{product?.name}</code>&quot; product and its data from the
              system.
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
                if (product?.id) window.db.deleteProduct(product?.id)
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
