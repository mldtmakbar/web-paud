"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusIcon, PenIcon, TrashIcon } from "lucide-react"
import { Payment, PaymentType, Student } from '@/lib/types'
import { getPayments, addPayment, updatePayment, deletePayment, getPaymentTypes, getStudents } from '@/lib/database'

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState({
    student_id: '',
    payment_type_id: '',
    semester: 'Semester 1',
    academic_year: '2024/2025',
    amount: '',
    discount: '0',
    scholarship: '0',
    status: 'pending',
    due_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [paymentsData, paymentTypesData, studentsData] = await Promise.all([
        getPayments(),
        getPaymentTypes(),
        getStudents()
      ])
      setPayments(paymentsData)
      setPaymentTypes(paymentTypesData)
      setStudents(studentsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const paymentData = {
        student_id: formData.student_id,
        payment_type_id: formData.payment_type_id,
        semester: formData.semester,
        academic_year: formData.academic_year,
        amount: parseFloat(formData.amount),
        discount: parseFloat(formData.discount),
        scholarship: parseFloat(formData.scholarship),
        status: formData.status,
        due_date: formData.due_date
      }

      if (selectedPayment) {
        await updatePayment(selectedPayment.id, paymentData)
      } else {
        await addPayment(paymentData)
      }
      
      await loadData()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving payment:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      student_id: '',
      payment_type_id: '',
      semester: 'Semester 1',
      academic_year: '2024/2025',
      amount: '',
      discount: '0',
      scholarship: '0',
      status: 'pending',
      due_date: new Date().toISOString().split('T')[0]
    })
    setSelectedPayment(null)
  }

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment)
    setFormData({
      student_id: payment.student_id,
      payment_type_id: payment.payment_type_id,
      semester: payment.semester,
      academic_year: payment.academic_year,
      amount: payment.amount.toString(),
      discount: payment.discount.toString(),
      scholarship: payment.scholarship.toString(),
      status: payment.status,
      due_date: payment.due_date || new Date().toISOString().split('T')[0]
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
      try {
        await deletePayment(id)
        await loadData()
      } catch (error) {
        console.error('Error deleting payment:', error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    }
    return `px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pembayaran</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Tambah Pembayaran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pembayaran</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student_id">Siswa</Label>
                <Select value={formData.student_id} onValueChange={value => setFormData({...formData, student_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_type_id">Jenis Pembayaran</Label>
                <Select value={formData.payment_type_id} onValueChange={value => setFormData({...formData, payment_type_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - {type.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select value={formData.semester} onValueChange={value => setFormData({...formData, semester: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1</SelectItem>
                    <SelectItem value="Semester 2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="academic_year">Tahun Ajaran</Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={e => setFormData({...formData, academic_year: e.target.value})}
                  placeholder="2024/2025"
                />
              </div>

              <div>
                <Label htmlFor="amount">Jumlah</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="discount">Diskon</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={e => setFormData({...formData, discount: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="scholarship">Beasiswa</Label>
                <Input
                  id="scholarship"
                  type="number"
                  value={formData.scholarship}
                  onChange={e => setFormData({...formData, scholarship: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="due_date">Jatuh Tempo</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={e => setFormData({...formData, due_date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={value => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                    <SelectItem value="overdue">Terlambat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Siswa</th>
                  <th className="text-left py-2 px-4">Jenis Pembayaran</th>
                  <th className="text-left py-2 px-4">Semester</th>
                  <th className="text-left py-2 px-4">Tahun Ajaran</th>
                  <th className="text-left py-2 px-4">Jumlah</th>
                  <th className="text-left py-2 px-4">Total Bayar</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Jatuh Tempo</th>
                  <th className="text-left py-2 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-2 px-4">{payment.students?.name || '-'}</td>
                    <td className="py-2 px-4">{payment.payment_types?.name || '-'}</td>
                    <td className="py-2 px-4">{payment.semester}</td>
                    <td className="py-2 px-4">{payment.academic_year}</td>
                    <td className="py-2 px-4">Rp {payment.amount.toLocaleString('id-ID')}</td>
                    <td className="py-2 px-4">Rp {payment.total_due.toLocaleString('id-ID')}</td>
                    <td className="py-2 px-4">
                      <span className={getStatusBadge(payment.status)}>
                        {payment.status === 'paid' ? 'Lunas' : payment.status === 'pending' ? 'Pending' : 'Terlambat'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {payment.due_date ? new Date(payment.due_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(payment)}
                        >
                          <PenIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(payment.id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student_id">Siswa</Label>
              <Select value={formData.student_id} onValueChange={value => setFormData({...formData, student_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_type_id">Jenis Pembayaran</Label>
              <Select value={formData.payment_type_id} onValueChange={value => setFormData({...formData, payment_type_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - {type.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester} onValueChange={value => setFormData({...formData, semester: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semester 1">Semester 1</SelectItem>
                  <SelectItem value="Semester 2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="academic_year">Tahun Ajaran</Label>
              <Input
                id="academic_year"
                value={formData.academic_year}
                onChange={e => setFormData({...formData, academic_year: e.target.value})}
                placeholder="2024/2025"
              />
            </div>

            <div>
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="discount">Diskon</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={e => setFormData({...formData, discount: e.target.value})}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="scholarship">Beasiswa</Label>
              <Input
                id="scholarship"
                type="number"
                value={formData.scholarship}
                onChange={e => setFormData({...formData, scholarship: e.target.value})}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="due_date">Jatuh Tempo</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={e => setFormData({...formData, due_date: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={value => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="overdue">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
