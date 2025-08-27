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
import { getTeachers, addTeacher, updateTeacher } from '@/lib/database'
import { deleteTeacher } from '@/lib/teacher-service'
import { PlusIcon, PenIcon, TrashIcon, EyeIcon } from "lucide-react"
import type { Teacher } from '@/lib/types'

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  
  const initialFormData = {
    name: '',
    nip: '',
    gender: '',
    date_of_birth: '',
    address: '',
    phone: '',
    email: '',
    position: '',
    status: 'active'
  }
  
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    loadTeachers()
  }, [])

  async function loadTeachers() {
    setIsLoading(true)
    try {
      const data = await getTeachers()
      setTeachers(data)
    } catch (error) {
      console.error('Error loading teachers:', error)
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      return
    }
    try {
      await deleteTeacher(id)
      await loadTeachers()
    } catch (error) {
      console.error('Error deleting teacher:', error)
      alert('Gagal menghapus data guru')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (selectedTeacher) {
        await updateTeacher(selectedTeacher.id, formData)
      } else {
        await addTeacher(formData)
      }
      await loadTeachers()
      handleCloseDialogs()
    } catch (error) {
      console.error('Error saving teacher:', error)
    }
  }

  function handleEdit(teacher: Teacher) {
    setSelectedTeacher(teacher)
    setFormData({
      name: teacher.name,
      nip: teacher.nip,
      gender: teacher.gender,
      date_of_birth: teacher.date_of_birth,
      address: teacher.address,
      phone: teacher.phone,
      email: teacher.email,
      position: teacher.position,
      status: teacher.status
    })
    setIsEditDialogOpen(true)
  }

  function handleView(teacher: Teacher) {
    setSelectedTeacher(teacher)
    setIsViewDialogOpen(true)
  }

  function handleAdd() {
    setSelectedTeacher(null)
    setFormData(initialFormData)
    setIsAddDialogOpen(true)
  }

  function handleCloseDialogs() {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsViewDialogOpen(false)
    setSelectedTeacher(null)
    setFormData(initialFormData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Guru</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Tambah Guru
        </Button>
      </div>

      <div className="grid gap-4">
        {teachers.length === 0 ? (
          <div className="text-center py-8">
            <p>Belum ada data guru</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left">NIP</th>
                  <th className="py-2 px-4 text-left">Nama</th>
                  <th className="py-2 px-4 text-left">Jenis Kelamin</th>
                  <th className="py-2 px-4 text-left">Jabatan</th>
                  <th className="py-2 px-4 text-left">Telepon</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t">
                    <td className="py-2 px-4">{teacher.nip}</td>
                    <td className="py-2 px-4">{teacher.name}</td>
                    <td className="py-2 px-4">
                      {teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </td>
                    <td className="py-2 px-4">{teacher.position}</td>
                    <td className="py-2 px-4">{teacher.phone}</td>
                    <td className="py-2 px-4">
                      {teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(teacher)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(teacher)}
                        >
                          <PenIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-500 hover:border-red-500"
                          onClick={() => handleDelete(teacher.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Guru Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Nama</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-nip">NIP</Label>
              <Input
                id="add-nip"
                value={formData.nip}
                onChange={e => setFormData({...formData, nip: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-gender">Jenis Kelamin</Label>
              <Select
                value={formData.gender}
                onValueChange={value => setFormData({...formData, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-date_of_birth">Tanggal Lahir</Label>
              <Input
                id="add-date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-address">Alamat</Label>
              <Input
                id="add-address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Telepon</Label>
              <Input
                id="add-phone"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-position">Jabatan</Label>
              <Input
                id="add-position"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={value => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                Batal
              </Button>
              <Button type="submit">Tambah Guru</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Guru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-nip">NIP</Label>
              <Input
                id="edit-nip"
                value={formData.nip}
                onChange={e => setFormData({...formData, nip: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-gender">Jenis Kelamin</Label>
              <Select
                value={formData.gender}
                onValueChange={value => setFormData({...formData, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date_of_birth">Tanggal Lahir</Label>
              <Input
                id="edit-date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Alamat</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telepon</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position">Jabatan</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={value => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                Batal
              </Button>
              <Button type="submit">Update Guru</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Guru</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NIP</Label>
                  <p className="text-sm">{selectedTeacher.nip}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                  <p className="text-sm">{selectedTeacher.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</Label>
                  <p className="text-sm">{selectedTeacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Jabatan</Label>
                  <p className="text-sm">{selectedTeacher.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tanggal Lahir</Label>
                  <p className="text-sm">{new Date(selectedTeacher.date_of_birth).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Telepon</Label>
                  <p className="text-sm">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedTeacher.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm">{selectedTeacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Alamat</Label>
                <p className="text-sm">{selectedTeacher.address}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleCloseDialogs}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
