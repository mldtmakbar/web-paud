"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Settings, ArrowUp, ArrowDown } from "lucide-react"
import { getPaymentTypes, addPaymentType, updatePaymentType, deletePaymentType } from "@/lib/database"
import { PaymentType } from "@/lib/types"

export function PaymentTypesManagement() {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<PaymentType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadPaymentTypes()
  }, [])

  const loadPaymentTypes = async () => {
    setIsLoading(true)
    try {
      const data = await getPaymentTypes()
      setPaymentTypes(data || [])
    } catch (error) {
      console.error('Error loading payment types:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTypes = paymentTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddType = async (typeData: {
    name: string
    code: string
    description?: string
    default_amount: number
    is_active: boolean
    category: string
    display_order?: number
  }) => {
    try {
      const newType = await addPaymentType(typeData)
      if (newType) {
        setPaymentTypes([...paymentTypes, newType])
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error('Error adding payment type:', error)
    }
  }

  const handleEditType = async (typeData: PaymentType) => {
    try {
      const updatedType = await updatePaymentType(typeData.id, {
        name: typeData.name,
        code: typeData.code,
        description: typeData.description,
        default_amount: typeData.default_amount,
        is_active: typeData.is_active,
        category: typeData.category,
        display_order: typeData.display_order
      })
      if (updatedType) {
        setPaymentTypes(paymentTypes.map((t) => (t.id === typeData.id ? updatedType : t)))
        setEditingType(null)
      }
    } catch (error) {
      console.error('Error updating payment type:', error)
    }
  }

  const handleDeleteType = async (id: string) => {
    try {
      const success = await deletePaymentType(id)
      if (success) {
        setPaymentTypes(paymentTypes.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting payment type:', error)
    }
  }

  const handleToggleActive = async (id: string) => {
    const type = paymentTypes.find(t => t.id === id)
    if (type) {
      try {
        const updatedType = await updatePaymentType(id, { is_active: !type.is_active })
        if (updatedType) {
          setPaymentTypes(paymentTypes.map((t) => (t.id === id ? updatedType : t)))
        }
      } catch (error) {
        console.error('Error toggling payment type status:', error)
      }
    }
  }

  const moveType = (id: string, direction: "up" | "down") => {
    const currentIndex = paymentTypes.findIndex((t) => t.id === id)
    if (currentIndex === -1) return

    const newTypes = [...paymentTypes]
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (targetIndex >= 0 && targetIndex < newTypes.length) {
      ;[newTypes[currentIndex], newTypes[targetIndex]] = [newTypes[targetIndex], newTypes[currentIndex]]

      // Update display_order numbers
      newTypes.forEach((type, index) => {
        type.display_order = index + 1
      })

      setPaymentTypes(newTypes)
    }
  }

  const getCategoryBadge = (category: PaymentType["category"]) => {
    switch (category) {
      case "Wajib":
        return <Badge className="bg-red-100 text-red-800">Wajib</Badge>
      case "Opsional":
        return <Badge className="bg-blue-100 text-blue-800">Opsional</Badge>
      case "Potongan":
        return <Badge className="bg-green-100 text-green-800">Potongan</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manajemen Jenis Pembayaran
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Kelola jenis-jenis pembayaran yang tersedia</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jenis Pembayaran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Jenis Pembayaran</DialogTitle>
              </DialogHeader>
              <PaymentTypeForm onSubmit={handleAddType} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Cari berdasarkan nama atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Payment Types Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Urutan</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Jumlah Default</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTypes.map((type, index) => (
                <TableRow key={type.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{type.display_order}</span>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveType(type.id, "up")}
                          disabled={index === 0}
                          className="h-4 w-4 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveType(type.id, "down")}
                          disabled={index === filteredTypes.length - 1}
                          className="h-4 w-4 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{type.code}</code>
                  </TableCell>
                  <TableCell>{getCategoryBadge(type.category)}</TableCell>
                  <TableCell>{formatCurrency(type.default_amount)}</TableCell>
                  <TableCell>
                    <Switch checked={type.is_active} onCheckedChange={() => handleToggleActive(type.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={editingType?.id === type.id} onOpenChange={(open) => !open && setEditingType(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingType(type)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Jenis Pembayaran</DialogTitle>
                          </DialogHeader>
                          <PaymentTypeForm initialData={type} onSubmit={handleEditType} isEdit />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteType(type.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
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
  )
}

interface PaymentTypeFormProps {
  initialData?: PaymentType
  onSubmit: (data: any) => void
  isEdit?: boolean
}

function PaymentTypeForm({ initialData, onSubmit, isEdit = false }: PaymentTypeFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    default_amount: initialData?.default_amount || 0,
    is_active: initialData?.is_active ?? true,
    category: initialData?.category || "Wajib",
    display_order: initialData?.display_order || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      ...(isEdit && { id: initialData!.id }),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Jenis Pembayaran</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: UP3"
            required
          />
        </div>

        <div>
          <Label htmlFor="code">Kode</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
            placeholder="Contoh: up3"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={formData.category}
            onValueChange={(value: any) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wajib">Wajib</SelectItem>
              <SelectItem value="Opsional">Opsional</SelectItem>
              <SelectItem value="Potongan">Potongan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="defaultAmount">Jumlah Default</Label>
          <Input
            id="defaultAmount"
            type="number"
            value={formData.default_amount}
            onChange={(e) => setFormData({ ...formData, default_amount: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi singkat tentang jenis pembayaran ini"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="isActive">Aktif</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">{isEdit ? "Update" : "Tambah"} Jenis Pembayaran</Button>
      </div>
    </form>
  )
}
