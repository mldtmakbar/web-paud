"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, DollarSign, CreditCard, AlertCircle } from "lucide-react"
import { mockStudents, mockPayments } from "@/lib/mock-data"

interface Payment {
  id: string
  studentId: string
  studentName: string
  semester: string
  tahunAjaran: string
  up3: number
  sdp2: number
  bppPaket: number
  bppNonPaket: number
  sks: number
  perpustakaan: number
  mangkir: number
  uangStatus: number
  biayaKesehatan: number
  asrama: number
  total: number
  potongan: number
  beasiswa: number
  totalTagihan: number
  status: "paid" | "partial" | "unpaid"
  dueDate: string
}

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPayments = payments.filter(
    (payment) =>
      (payment.studentName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (payment.semester?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  const handleAddPayment = (paymentData: Omit<Payment, "id">) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `payment-${Date.now()}`,
    }
    setPayments([...payments, newPayment])
    setIsAddDialogOpen(false)
  }

  const handleEditPayment = (paymentData: Payment) => {
    setPayments(payments.map((p) => (p.id === paymentData.id ? paymentData : p)))
    setEditingPayment(null)
  }

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Lunas</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Sebagian</Badge>
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800">Belum Bayar</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalPaid = payments.filter((p) => p.status === "paid").length
  const totalPartial = payments.filter((p) => p.status === "partial").length
  const totalUnpaid = payments.filter((p) => p.status === "unpaid").length
  const totalRevenue = payments.reduce((sum, p) => sum + (p.total - p.potongan - p.beasiswa), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Manajemen Pembayaran
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Kelola data pembayaran siswa TK Ceria</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pembayaran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Data Pembayaran</DialogTitle>
              </DialogHeader>
              <PaymentForm onSubmit={handleAddPayment} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Lunas</p>
                  <p className="text-2xl font-bold text-green-600">{totalPaid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Sebagian</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalPartial}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Belum Bayar</p>
                  <p className="text-2xl font-bold text-red-600">{totalUnpaid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Cari berdasarkan nama siswa atau semester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Payments Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>UP3</TableHead>
                <TableHead>SDP2</TableHead>
                <TableHead>BPP Paket</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Potongan</TableHead>
                <TableHead>Beasiswa</TableHead>
                <TableHead>Total Tagihan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.tahunAjaran}</TableCell>
                  <TableCell>{payment.semester}</TableCell>
                  <TableCell>{payment.studentName}</TableCell>
                  <TableCell>{formatCurrency(payment.up3)}</TableCell>
                  <TableCell>{formatCurrency(payment.sdp2)}</TableCell>
                  <TableCell>{formatCurrency(payment.bppPaket)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.total)}</TableCell>
                  <TableCell>{formatCurrency(payment.potongan)}</TableCell>
                  <TableCell>{formatCurrency(payment.beasiswa)}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(payment.totalTagihan)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{new Date(payment.dueDate).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <Dialog
                      open={editingPayment?.id === payment.id}
                      onOpenChange={(open) => !open && setEditingPayment(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingPayment(payment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Data Pembayaran</DialogTitle>
                        </DialogHeader>
                        <PaymentForm initialData={payment} onSubmit={handleEditPayment} isEdit />
                      </DialogContent>
                    </Dialog>
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

interface PaymentFormProps {
  initialData?: Payment
  onSubmit: (data: any) => void
  isEdit?: boolean
}

function PaymentForm({ initialData, onSubmit, isEdit = false }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    studentId: initialData?.studentId || "",
    studentName: initialData?.studentName || "",
    semester: initialData?.semester || "",
    tahunAjaran: initialData?.tahunAjaran || "",
    up3: initialData?.up3 || 0,
    sdp2: initialData?.sdp2 || 0,
    bppPaket: initialData?.bppPaket || 0,
    bppNonPaket: initialData?.bppNonPaket || 0,
    sks: initialData?.sks || 0,
    perpustakaan: initialData?.perpustakaan || 0,
    mangkir: initialData?.mangkir || 0,
    uangStatus: initialData?.uangStatus || 0,
    biayaKesehatan: initialData?.biayaKesehatan || 0,
    asrama: initialData?.asrama || 0,
    potongan: initialData?.potongan || 0,
    beasiswa: initialData?.beasiswa || 0,
    status: initialData?.status || "unpaid",
    dueDate: initialData?.dueDate || "",
  })

  const calculateTotal = () => {
    const total =
      formData.up3 +
      formData.sdp2 +
      formData.bppPaket +
      formData.bppNonPaket +
      formData.sks +
      formData.perpustakaan +
      formData.mangkir +
      formData.uangStatus +
      formData.biayaKesehatan +
      formData.asrama
    return total
  }

  const calculateTotalTagihan = () => {
    return calculateTotal() - formData.potongan - formData.beasiswa
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const total = calculateTotal()
    const totalTagihan = calculateTotalTagihan()

    const paymentData = {
      ...formData,
      total,
      totalTagihan,
      ...(isEdit && { id: initialData!.id }),
    }

    onSubmit(paymentData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentName">Nama Siswa</Label>
          <Select
            value={formData.studentName}
            onValueChange={(value) => {
              const student = mockStudents.find((s) => s.name === value)
              setFormData({
                ...formData,
                studentName: value,
                studentId: student?.id || "",
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih siswa" />
            </SelectTrigger>
            <SelectContent>
              {mockStudents.map((student) => (
                <SelectItem key={student.id} value={student.name}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tahunAjaran">Tahun Ajaran</Label>
          <Input
            id="tahunAjaran"
            value={formData.tahunAjaran}
            onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
            placeholder="2024/2025"
            required
          />
        </div>

        <div>
          <Label htmlFor="semester">Semester</Label>
          <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status Pembayaran</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="partial">Sebagian</SelectItem>
              <SelectItem value="unpaid">Belum Bayar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="up3">UP3</Label>
          <Input
            id="up3"
            type="number"
            value={formData.up3}
            onChange={(e) => setFormData({ ...formData, up3: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="sdp2">SDP2</Label>
          <Input
            id="sdp2"
            type="number"
            value={formData.sdp2}
            onChange={(e) => setFormData({ ...formData, sdp2: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="bppPaket">BPP Paket</Label>
          <Input
            id="bppPaket"
            type="number"
            value={formData.bppPaket}
            onChange={(e) => setFormData({ ...formData, bppPaket: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="bppNonPaket">BPP Non Paket</Label>
          <Input
            id="bppNonPaket"
            type="number"
            value={formData.bppNonPaket}
            onChange={(e) => setFormData({ ...formData, bppNonPaket: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="sks">SKS</Label>
          <Input
            id="sks"
            type="number"
            value={formData.sks}
            onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="perpustakaan">Perpustakaan</Label>
          <Input
            id="perpustakaan"
            type="number"
            value={formData.perpustakaan}
            onChange={(e) => setFormData({ ...formData, perpustakaan: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="biayaKesehatan">Biaya Kesehatan</Label>
          <Input
            id="biayaKesehatan"
            type="number"
            value={formData.biayaKesehatan}
            onChange={(e) => setFormData({ ...formData, biayaKesehatan: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="potongan">Potongan</Label>
          <Input
            id="potongan"
            type="number"
            value={formData.potongan}
            onChange={(e) => setFormData({ ...formData, potongan: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="beasiswa">Beasiswa</Label>
          <Input
            id="beasiswa"
            type="number"
            value={formData.beasiswa}
            onChange={(e) => setFormData({ ...formData, beasiswa: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate">Jatuh Tempo</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Total: </span>
            <span>
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                calculateTotal(),
              )}
            </span>
          </div>
          <div>
            <span className="font-medium">Potongan + Beasiswa: </span>
            <span>
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                formData.potongan + formData.beasiswa,
              )}
            </span>
          </div>
          <div>
            <span className="font-medium">Total Tagihan: </span>
            <span className="font-bold text-primary">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                calculateTotalTagihan(),
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">{isEdit ? "Update" : "Tambah"} Pembayaran</Button>
      </div>
    </form>
  )
}
