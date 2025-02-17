"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "name",
    header: "Customer Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "amountInUsd",
    header: "Converted Amount (USD)",
  },
  {
    accessorKey: "salesRep",
    header: "Sales Rep",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
]

