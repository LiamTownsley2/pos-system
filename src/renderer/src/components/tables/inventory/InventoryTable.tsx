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
import React, { useEffect, useMemo } from 'react'
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

export function InventoryTable({ inventory }: { inventory: Product[] }): React.JSX.Element {
  const [categoryMap, setCategoryMap] = React.useState<Category[]>([])
  const [dialog, setDialog] = React.useState<null | 'edit' | 'delete'>(null)
  const [product, setProduct] = React.useState<null | Product>(null)

  useEffect(() => {
    window.db.getAllCategories().then((categories) => {
      setCategoryMap(categories)
    })
  }, [])

  const columns = useMemo(
    () => getInventoryColumns(categoryMap, setDialog, setProduct),
    [categoryMap]
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data: inventory,
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
  return (
    <>
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
      </div>

      <Dialog
        open={dialog == 'edit'}
        onOpenChange={() => {
          setDialog(null)
          setProduct(null)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to a product here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={product?.name} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="price-1">Price per Unit</Label>
              <Input
                id="price-1"
                name="price"
                defaultValue={product?.price_per_unit}
                type="number"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="unit-1">Unit</Label>
              <Input id="unit-1" name="unit" defaultValue={product?.unit} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category-1">Category</Label>
              <Input id="category-1" name="category" defaultValue={product?.category} />
            </div>
          </div>
          <DialogFooter className="flex flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="grow">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog == 'delete'}
        onOpenChange={() => {
          setDialog(null)
          setProduct(null)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>{' '}
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
            <Button type="submit" variant={'destructive'}>
              Yes, I&apos;m sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
