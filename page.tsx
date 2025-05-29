"use client"

import { useState } from "react"
import { Package, AlertTriangle, TrendingUp, Users, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddSupplyDialog } from "@/components/add-supply-dialog"
import { EditSupplyDialog } from "@/components/edit-supply-dialog"

// Sample data - in a real app, this would come from your SQL database
const medicalSupplies = [
  {
    id: 1,
    name: "Surgical Masks",
    category: "PPE",
    supplier: "MedCorp Inc",
    quantity: 150,
    minStock: 100,
    unitPrice: 0.75,
    expiryDate: "2025-12-31",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Disposable Gloves",
    category: "PPE",
    supplier: "SafeGuard Medical",
    quantity: 45,
    minStock: 50,
    unitPrice: 0.25,
    expiryDate: "2025-08-15",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Insulin Syringes",
    category: "Injection",
    supplier: "PharmaSupply Co",
    quantity: 200,
    minStock: 75,
    unitPrice: 1.5,
    expiryDate: "2026-03-20",
    status: "In Stock",
  },
  {
    id: 4,
    name: "Bandages",
    category: "Wound Care",
    supplier: "MedCorp Inc",
    quantity: 25,
    minStock: 30,
    unitPrice: 2.0,
    expiryDate: "2027-01-10",
    status: "Low Stock",
  },
  {
    id: 5,
    name: "Thermometers",
    category: "Diagnostic",
    supplier: "TechMed Solutions",
    quantity: 80,
    minStock: 20,
    unitPrice: 15.0,
    expiryDate: "2028-06-30",
    status: "In Stock",
  },
]

export default function MedicalSupplyDashboard() {
  const [supplies, setSupplies] = useState(medicalSupplies)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSupply, setEditingSupply] = useState(null)

  // Filter supplies based on search and filters
  const filteredSupplies = supplies.filter((supply) => {
    const matchesSearch =
      supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter
    const matchesStatus = statusFilter === "all" || supply.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate dashboard stats
  const totalSupplies = supplies.length
  const lowStockItems = supplies.filter((s) => s.quantity <= s.minStock).length
  const totalValue = supplies.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0)
  const uniqueSuppliers = new Set(supplies.map((s) => s.supplier)).size

  const getStatusBadge = (status: string) => {
    if (status === "Low Stock") {
      return <Badge variant="destructive">{status}</Badge>
    }
    return <Badge variant="default">{status}</Badge>
  }

  const handleAddSupply = (newSupply: any) => {
    const supply = {
      ...newSupply,
      id: Math.max(...supplies.map((s) => s.id)) + 1,
      status: newSupply.quantity <= newSupply.minStock ? "Low Stock" : "In Stock",
    }
    setSupplies([...supplies, supply])
  }

  const handleEditSupply = (updatedSupply: any) => {
    const updated = {
      ...updatedSupply,
      status: updatedSupply.quantity <= updatedSupply.minStock ? "Low Stock" : "In Stock",
    }
    setSupplies(supplies.map((s) => (s.id === updated.id ? updated : s)))
    setEditingSupply(null)
  }

  const handleDeleteSupply = (id: number) => {
    setSupplies(supplies.filter((s) => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Supply Management</h1>
            <p className="text-gray-600">Manage your medical inventory efficiently</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Supply
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Supplies</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSupplies}</div>
              <p className="text-xs text-muted-foreground">Active inventory items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSuppliers}</div>
              <p className="text-xs text-muted-foreground">Active suppliers</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Search and filter your medical supplies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search supplies or suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="PPE">PPE</SelectItem>
                  <SelectItem value="Injection">Injection</SelectItem>
                  <SelectItem value="Wound Care">Wound Care</SelectItem>
                  <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Supplies Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupplies.map((supply) => (
                    <TableRow key={supply.id}>
                      <TableCell className="font-medium">{supply.name}</TableCell>
                      <TableCell>{supply.category}</TableCell>
                      <TableCell>{supply.supplier}</TableCell>
                      <TableCell>
                        <span className={supply.quantity <= supply.minStock ? "text-red-600 font-semibold" : ""}>
                          {supply.quantity}
                        </span>
                        <span className="text-muted-foreground text-sm"> / {supply.minStock} min</span>
                      </TableCell>
                      <TableCell>${supply.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>{supply.expiryDate}</TableCell>
                      <TableCell>{getStatusBadge(supply.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingSupply(supply)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSupply(supply.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddSupplyDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddSupply={handleAddSupply} />

      {editingSupply && (
        <EditSupplyDialog
          open={!!editingSupply}
          onOpenChange={() => setEditingSupply(null)}
          supply={editingSupply}
          onEditSupply={handleEditSupply}
        />
      )}
    </div>
  )
}
