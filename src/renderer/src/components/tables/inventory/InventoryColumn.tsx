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
import { Product } from 'src/types/product'
import { Category } from 'src/types/categories'
import { Dialog, DialogTrigger } from '@renderer/components/ui/dialog'

export function getInventoryColumns(
  categoryMap: Category[],
  setDialog: (d: 'edit' | 'delete' | null) => void,
  setProduct: (d: Product | null) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>
    },
    {
      accessorKey: 'price_per_unit',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Price
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('price_per_unit'))
        const formatted = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP'
        }).format(amount)

        return (
          <div>
            {formatted} / {row.original.unit}
          </div>
        )
      }
    },
    {
      accessorKey: 'category',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Category
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = categoryMap.find((x) => x.id == row.getValue('category'))
        return (
          <div className="capitalize flex flex-row gap-2">
            <span
              className="h-3 w-3 rounded-full block my-auto"
              style={{ backgroundColor: category?.colour }}
            />
            {category?.name}
          </div>
        )
      }
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Stock
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue('stock')}</div>
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                  <Copy />
                  Copy Product ID
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => {
                      setDialog('edit')
                      setProduct(product)
                    }}
                  >
                    <Edit />
                    Edit Product
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setDialog('delete')
                    setProduct(product)
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
