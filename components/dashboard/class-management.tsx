"use client"

import { useState, useEffect, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, PenIcon, TrashIcon, EyeIcon } from "lucide-react"
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
import { getClasses, addClass, updateClass, deleteClass, getTeachers } from '@/lib/database'
import type { Class, Teacher } from '@/lib/types'

type ClassStatus = 'active' | 'inactive';

type ClassFormData = {
  name: string;
  code: string;
  teacher_id: string | null;
  school_year: string;
  capacity: number | undefined;
  current_students: number;
  room: string | undefined;
  status: ClassStatus;
}

const ClassManagement = () => {
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  const initialFormData: ClassFormData = {
    name: '',
    code: '',
    teacher_id: null,
    school_year: '',
    capacity: undefined,
    current_students: 0,
    room: undefined,
    status: 'active'
  }

  const [formData, setFormData] = useState<ClassFormData>(initialFormData)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [classesData, teachersData] = await Promise.all([
        getClasses(),
        getTeachers()
      ])
      setClasses(classesData)
      setTeachers(teachersData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      return
    }
    try {
      await deleteClass(id)
      await loadData()
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Gagal menghapus kelas')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const dataToSubmit = {
        ...formData,
        capacity: formData.capacity,
        room: formData.room
      }
      
      if (selectedClass) {
        await updateClass(selectedClass.id, dataToSubmit)
      } else {
        await addClass(dataToSubmit)
      }
      await loadData()
      handleCloseDialogs()
    } catch (error) {
      console.error('Error saving class:', error)
      alert('Gagal menyimpan kelas. Silakan coba lagi.')
    }
  }

  function handleEdit(classData: Class) {
    setSelectedClass(classData)
    const formData: ClassFormData = {
      name: classData.name,
      code: classData.code,
      teacher_id: classData.teacher_id,
      school_year: classData.school_year,
      capacity: classData.capacity,
      current_students: classData.current_students ?? 0,
      room: classData.room,
      status: classData.status as ClassStatus
    }
    setFormData(formData)
    setIsEditDialogOpen(true)
  }

  function handleView(classData: Class) {
    setSelectedClass(classData)
    setIsViewDialogOpen(true)
  }

  function handleAdd() {
    setSelectedClass(null)
    setFormData(initialFormData)
    setIsAddDialogOpen(true)
  }

  function handleCloseDialogs() {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsViewDialogOpen(false)
    setSelectedClass(null)
    setFormData(initialFormData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Kelas</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Tambah Kelas
        </Button>
      </div>

      <div className="grid gap-4">
        {classes.length === 0 ? (
          <div className="text-center py-8">
            <p>Belum ada data kelas</p>
          </div>
        ) : (
          <div className="rounded-lg border shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Kode</th>
                  <th className="py-3 px-4 text-left font-medium">Nama</th>
                  <th className="py-3 px-4 text-left font-medium">Wali Kelas</th>
                  <th className="py-3 px-4 text-left font-medium">Tahun Ajaran</th>
                  <th className="py-3 px-4 text-left font-medium">Kapasitas</th>
                  <th className="py-3 px-4 text-left font-medium">Jumlah Siswa</th>
                  <th className="py-3 px-4 text-left font-medium">Ruangan</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-center font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classData) => {
                  const teacher = teachers.find(t => t.id === classData.teacher_id)
                  return (
                    <tr key={classData.id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4">{classData.code}</td>
                      <td className="py-3 px-4">{classData.name}</td>
                      <td className="py-3 px-4">{teacher?.name || '-'}</td>
                      <td className="py-3 px-4">{classData.school_year}</td>
                      <td className="py-3 px-4">{classData.capacity || '-'}</td>
                      <td className="py-3 px-4">{classData.current_students || 0}</td>
                      <td className="py-3 px-4">{classData.room || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          classData.status === 'active' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {classData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleView(classData)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(classData)}
                          >
                            <PenIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-500 hover:border-red-500"
                            onClick={() => handleDelete(classData.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kelas Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Nama Kelas</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-code">Kode Kelas</Label>
                <Input
                  id="add-code"
                  value={formData.code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-capacity">Kapasitas Kelas</Label>
                <Input
                  id="add-capacity"
                  type="number"
                  value={formData.capacity?.toString() || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setFormData({...formData, capacity: e.target.value ? Number(e.target.value) : undefined})}
                  placeholder="Masukkan kapasitas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-room">Ruangan</Label>
                <Input
                  id="add-room"
                  value={formData.room ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setFormData({...formData, room: e.target.value || undefined})}
                  placeholder="Masukkan ruangan"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-teacher_id">Wali Kelas</Label>
                <Select
                  value={formData.teacher_id || undefined}
                  onValueChange={(value: string) => setFormData({...formData, teacher_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih wali kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-school_year">Tahun Ajaran</Label>
                <Input
                  id="add-school_year"
                  value={formData.school_year}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setFormData({...formData, school_year: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ClassStatus) => setFormData({...formData, status: value})}
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
              <Button type="submit">Tambah Kelas</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Kelas</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Kelas</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Kode Kelas</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, code: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Kapasitas Kelas</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={formData.capacity?.toString() || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      setFormData({...formData, capacity: e.target.value ? Number(e.target.value) : undefined})}
                    placeholder="Masukkan kapasitas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-room">Ruangan</Label>
                  <Input
                    id="edit-room"
                    value={formData.room ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      setFormData({...formData, room: e.target.value || undefined})}
                    placeholder="Masukkan ruangan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-teacher">Wali Kelas</Label>
                  <Select
                    value={formData.teacher_id || undefined}
                    onValueChange={(value: string) => setFormData({...formData, teacher_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih wali kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-school-year">Tahun Ajaran</Label>
                  <Input
                    id="edit-school-year"
                    value={formData.school_year}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      setFormData({...formData, school_year: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ClassStatus) => setFormData({...formData, status: value})}
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
                <Button type="submit">Update Kelas</Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Kelas</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kode Kelas</Label>
                  <p className="text-sm">{selectedClass.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama Kelas</Label>
                  <p className="text-sm">{selectedClass.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Wali Kelas</Label>
                  <p className="text-sm">{teachers.find(t => t.id === selectedClass.teacher_id)?.name || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tahun Ajaran</Label>
                  <p className="text-sm">{selectedClass.school_year}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kapasitas</Label>
                  <p className="text-sm">{selectedClass.capacity || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Jumlah Siswa</Label>
                  <p className="text-sm">{selectedClass.current_students || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ruangan</Label>
                  <p className="text-sm">{selectedClass.room || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm">{selectedClass.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</p>
                </div>
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

export default ClassManagement
