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
import { getClasses, addClass, updateClass, getTeachers } from '@/lib/database'
import type { Class, Teacher } from '@/lib/types'

export function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher_id: '',
    school_year: '',
    status: 'active'
  })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (selectedClass) {
        await updateClass(selectedClass.id, formData)
      } else {
        await addClass(formData)
      }
      await loadData()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setSelectedClass(null)
      setFormData({
        name: '',
        code: '',
        teacher_id: '',
        school_year: '',
        status: 'active'
      })
    } catch (error) {
      console.error('Error saving class:', error)
    }
  }

  function handleEdit(classData: Class) {
    setSelectedClass(classData)
    setFormData({
      name: classData.name,
      code: classData.code,
      teacher_id: classData.teacher_id,
      school_year: classData.school_year,
      status: classData.status
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Kelas</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Kelas</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kelas</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Kode Kelas</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher_id">Wali Kelas</Label>
                <Select
                  value={formData.teacher_id}
                  onValueChange={value => setFormData({...formData, teacher_id: value})}
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
                <Label htmlFor="school_year">Tahun Ajaran</Label>
                <Input
                  id="school_year"
                  value={formData.school_year}
                  onChange={e => setFormData({...formData, school_year: e.target.value})}
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
                {selectedClass ? 'Update' : 'Simpan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {classes.length === 0 ? (
          <div className="text-center py-8">
            <p>Belum ada data kelas</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left">Kode</th>
                  <th className="py-2 px-4 text-left">Nama</th>
                  <th className="py-2 px-4 text-left">Wali Kelas</th>
                  <th className="py-2 px-4 text-left">Tahun Ajaran</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classData) => {
                  const teacher = teachers.find(t => t.id === classData.teacher_id)
                  return (
                    <tr key={classData.id} className="border-t">
                      <td className="py-2 px-4">{classData.code}</td>
                      <td className="py-2 px-4">{classData.name}</td>
                      <td className="py-2 px-4">{teacher?.name || '-'}</td>
                      <td className="py-2 px-4">{classData.school_year}</td>
                      <td className="py-2 px-4">
                        {classData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </td>
                      <td className="py-2 px-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(classData)}>
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
            <DialogTitle>Edit Data Kelas</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as add dialog */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kelas</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Kode Kelas</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher_id">Wali Kelas</Label>
              <Select
                value={formData.teacher_id}
                onValueChange={value => setFormData({...formData, teacher_id: value})}
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
              <Label htmlFor="school_year">Tahun Ajaran</Label>
              <Input
                id="school_year"
                value={formData.school_year}
                onChange={e => setFormData({...formData, school_year: e.target.value})}
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
