"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditSupplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: any
  onEditSupply: (supply: any) => void
}

export function EditSupplyDialog({ open, onOpenChange, supply, onEditSupply }: EditSupplyDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    supplier: "",
    quantity: "",
    minStock: "",
    unitPrice: "",
    expiryDate: "",
  })

  useEffect(() => {
    if (supply) {
      setFormData({
        id: supply.id.toString(),
        name: supply.name,
        category: supply.category,
        supplier: supply.supplier,
        quantity: supply.quantity.toString(),
        minStock: supply.minStock.toString(),
        unitPrice: supply.unitPrice.toString(),
        expiryDate: supply.expiryDate,
      })
    }
  }, [supply])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedSupply = {
      ...formData,
      id: Number.parseInt(formData.id),
      quantity: Number.parseInt(formData.quantity),
      minStock: Number.parseInt(formData.minStock),
      unitPrice: Number.parseFloat(formData.unitPrice),
    }

    onEditSupply(updatedSupply)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Medical Supply</DialogTitle>
          <DialogDescription>Update the details for this medical supply item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PPE">PPE</SelectItem>
                  <SelectItem value="Injection">Injection</SelectItem>
                  <SelectItem value="Wound Care">Wound Care</SelectItem>
                  <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="Medication">Medication</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="edit-supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-minStock" className="text-right">
                Min Stock
              </Label>
              <Input
                id="edit-minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-unitPrice" className="text-right">
                Unit Price
              </Label>
              <Input
                id="edit-unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="edit-expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Supply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
