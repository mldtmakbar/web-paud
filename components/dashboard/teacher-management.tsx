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
import type { Teacher } from '@/lib/types'

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    gender: '',
    date_of_birth: '',
    address: '',
    phone: '',
    email: '',
    position: '',
    status: 'active'
  })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (selectedTeacher) {
        await updateTeacher(selectedTeacher.id, formData)
      } else {
        await addTeacher(formData)
      }
      await loadTeachers()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setSelectedTeacher(null)
      setFormData({
        name: '',
        nip: '',
        gender: '',
        date_of_birth: '',
        address: '',
        phone: '',
        email: '',
        position: '',
        status: 'active'
      })
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Guru</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Guru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Guru Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  value={formData.nip}
                  onChange={e => setFormData({...formData, nip: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
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
                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
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
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">
                {selectedTeacher ? 'Update' : 'Simpan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                      <Button variant="outline" size="sm" onClick={() => handleEdit(teacher)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Guru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as add dialog */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                value={formData.nip}
                onChange={e => setFormData({...formData, nip: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
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
              <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
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
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
