"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { 
  getPayments,
  getPaymentTypes,
  getStudents,
  addPayment,
  updatePayment
} from '@/lib/database'
import type { Payment, PaymentType, Student } from '@/lib/types'

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
    amount: '',
    status: 'pending',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
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
    }
    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount)
      }
      
      if (selectedPayment) {
        await updatePayment(selectedPayment.id, paymentData)
      } else {
        await addPayment(paymentData)
      }
      await loadData()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setSelectedPayment(null)
      setFormData({
        student_id: '',
        payment_type_id: '',
        amount: '',
        status: 'pending',
        payment_date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    } catch (error) {
      console.error('Error saving payment:', error)
    }
  }

  function handleEdit(payment: Payment) {
    setSelectedPayment(payment)
    setFormData({
      student_id: payment.student_id,
      payment_type_id: payment.payment_type_id,
      amount: payment.amount.toString(),
      status: payment.status,
      payment_date: new Date(payment.payment_date).toISOString().split('T')[0],
      notes: payment.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Pembayaran</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Pembayaran</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pembayaran Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Siswa</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={value => setFormData({...formData, student_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_type_id">Jenis Pembayaran</Label>
                <Select
                  value={formData.payment_type_id}
                  onValueChange={value => setFormData({...formData, payment_type_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_date">Tanggal Pembayaran</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={e => setFormData({...formData, payment_date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                    <SelectItem value="cancelled">Batal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <Button type="submit">
                {selectedPayment ? 'Update' : 'Simpan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p>Belum ada data pembayaran</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left">Tanggal</th>
                  <th className="py-2 px-4 text-left">Siswa</th>
                  <th className="py-2 px-4 text-left">Jenis Pembayaran</th>
                  <th className="py-2 px-4 text-left">Jumlah</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Catatan</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const student = students.find(s => s.id === payment.student_id)
                  const paymentType = paymentTypes.find(t => t.id === payment.payment_type_id)
                  return (
                    <tr key={payment.id} className="border-t">
                      <td className="py-2 px-4">
                        {new Date(payment.payment_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-2 px-4">{student?.name || '-'}</td>
                      <td className="py-2 px-4">{paymentType?.name || '-'}</td>
                      <td className="py-2 px-4">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(payment.amount)}
                      </td>
                      <td className="py-2 px-4">
                        {payment.status === 'paid' ? 'Lunas' : 
                         payment.status === 'pending' ? 'Pending' : 'Batal'}
                      </td>
                      <td className="py-2 px-4">{payment.notes || '-'}</td>
                      <td className="py-2 px-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(payment)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Pembayaran</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as add dialog */}
            <div className="space-y-2">
              <Label htmlFor="student_id">Siswa</Label>
              <Select
                value={formData.student_id}
                onValueChange={value => setFormData({...formData, student_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_type_id">Jenis Pembayaran</Label>
              <Select
                value={formData.payment_type_id}
                onValueChange={value => setFormData({...formData, payment_type_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Tanggal Pembayaran</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={e => setFormData({...formData, payment_date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={value => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="cancelled">Batal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
