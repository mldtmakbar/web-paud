"use client"

import { useState, useEffect, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, PenIcon, TrashIcon, EyeIcon, SearchIcon, FilterIcon } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [teacherFilter, setTeacherFilter] = useState<string>('all')

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

  useEffect(() => {
    filterClasses()
  }, [classes, searchTerm, statusFilter, teacherFilter])

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

  function filterClasses() {
    let filtered = classes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cls => 
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.school_year.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cls => cls.status === statusFilter)
    }

    // Teacher filter
    if (teacherFilter !== 'all') {
      filtered = filtered.filter(cls => cls.teacher_id === teacherFilter)
    }

    setFilteredClasses(filtered)
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Manajemen Kelas</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Kelola data kelas dan informasi wali kelas
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-gray-900 hover:bg-gray-800">
            <PlusIcon className="h-4 w-4 mr-2" />
            Tambah Kelas
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>

            {/* Teacher Filter */}
            <Select value={teacherFilter} onValueChange={setTeacherFilter}>
              <SelectTrigger>
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Wali Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wali Kelas</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <Badge variant="secondary" className="text-sm">
                {filteredClasses.length} dari {classes.length} kelas
              </Badge>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' || teacherFilter !== 'all' 
                    ? 'Tidak ada hasil yang ditemukan' 
                    : 'Belum ada data kelas'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || teacherFilter !== 'all'
                    ? 'Coba ubah filter atau kata kunci pencarian Anda'
                    : 'Mulai dengan menambahkan kelas pertama'}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Kode</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Nama</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Wali Kelas</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Tahun Ajaran</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Kapasitas</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Jumlah Siswa</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Ruangan</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-700 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClasses.map((classData) => {
                    const teacher = teachers.find(t => t.id === classData.teacher_id)
                    const occupancyPercentage = classData.capacity 
                      ? Math.round((classData.current_students || 0) / classData.capacity * 100)
                      : 0
                    
                    return (
                      <tr key={classData.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {classData.code}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">{classData.name}</td>
                        <td className="py-4 px-6">
                          {teacher ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-gray-700">
                                  {teacher.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-700">{teacher.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{classData.school_year}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{classData.capacity || '-'}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className="bg-gray-100 text-gray-800 border-gray-200"
                            >
                              {classData.current_students || 0}
                            </Badge>
                            {classData.capacity && (
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-gray-600"
                                  style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {classData.room ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {classData.room}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant={classData.status === 'active' ? 'default' : 'secondary'}
                            className={classData.status === 'active' 
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }
                          >
                            {classData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-50 hover:border-gray-200"
                              onClick={() => handleView(classData)}
                            >
                              <EyeIcon className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-50 hover:border-gray-200"
                              onClick={() => handleEdit(classData)}
                            >
                              <PenIcon className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 hover:border-red-200"
                              onClick={() => handleDelete(classData.id)}
                            >
                              <TrashIcon className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Tambah Kelas Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Nama Kelas</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Contoh: TK A, TK B"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-code">Kode Kelas</Label>
                <Input
                  id="add-code"
                  value={formData.code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, code: e.target.value})}
                  required
                  placeholder="Contoh: TK01, TK02"
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
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-room">Ruangan</Label>
                <Input
                  id="add-room"
                  value={formData.room ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setFormData({...formData, room: e.target.value || undefined})}
                  placeholder="Contoh: Ruang 1, Ruang 2"
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
                  placeholder="Contoh: 2024/2025"
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
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                Batal
              </Button>
                              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                  Tambah Kelas
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Data Kelas</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Kelas</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Contoh: TK A, TK B"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Kode Kelas</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, code: e.target.value})}
                    required
                    placeholder="Contoh: TK01, TK02"
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
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-room">Ruangan</Label>
                  <Input
                    id="edit-room"
                    value={formData.room ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      setFormData({...formData, room: e.target.value || undefined})}
                    placeholder="Contoh: Ruang 1, Ruang 2"
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
                    placeholder="Contoh: 2024/2025"
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
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                  Batal
                </Button>
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                  Update Kelas
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Detail Kelas</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Kode Kelas</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedClass.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nama Kelas</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedClass.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Wali Kelas</Label>
                    <p className="text-lg text-gray-900">{teachers.find(t => t.id === selectedClass.teacher_id)?.name || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tahun Ajaran</Label>
                    <p className="text-lg text-gray-900">{selectedClass.school_year}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Kapasitas</Label>
                    <p className="text-lg text-gray-900">{selectedClass.capacity || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Jumlah Siswa</Label>
                    <p className="text-lg text-gray-900">{selectedClass.current_students || 0}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ruangan</Label>
                    <p className="text-lg text-gray-900">{selectedClass.room || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge 
                      variant={selectedClass.status === 'active' ? 'default' : 'secondary'}
                      className={selectedClass.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {selectedClass.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={handleCloseDialogs}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ClassManagement
