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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTeachers, addTeacher, updateTeacher, getAccounts, addAccount, updateAccount, deleteAccount } from '@/lib/database'
import { deleteTeacher } from '@/lib/teacher-service'
import { PlusIcon, PenIcon, TrashIcon, EyeIcon, SearchIcon, FilterIcon, UserIcon, KeyIcon } from "lucide-react"
import type { Teacher, UserAccount } from '@/lib/types'

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [genderFilter, setGenderFilter] = useState<string>('all')
  const [positionFilter, setPositionFilter] = useState<string>('all')
  
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

  useEffect(() => {
    filterTeachers()
  }, [teachers, searchTerm, statusFilter, genderFilter, positionFilter])

  async function loadTeachers() {
    setIsLoading(true)
    try {
      const [teachersData, accountsData] = await Promise.all([
        getTeachers(),
        getAccounts()
      ])
      setTeachers(teachersData)
      setAccounts(accountsData)
    } catch (error) {
      console.error('Error loading teachers:', error)
    }
    setIsLoading(false)
  }

  function filterTeachers() {
    let filtered = teachers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === statusFilter)
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.gender === genderFilter)
    }

    // Position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.position === positionFilter)
    }

    setFilteredTeachers(filtered)
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
    setIsAccountDialogOpen(false)
    setSelectedTeacher(null)
    setFormData(initialFormData)
  }

  // Account management functions
  function handleAccount(teacher: Teacher) {
    setSelectedTeacher(teacher)
    setIsAccountDialogOpen(true)
  }

  async function handleCreateAccount(email: string, password: string) {
    if (!selectedTeacher) return

    const accountData = {
      email,
      password,
      role: 'teacher' as const,
      user_id: selectedTeacher.id,
      user_name: selectedTeacher.name,
      status: 'active' as const
    }

    try {
      const result = await addAccount(accountData)
      if (result) {
        await loadTeachers() // Reload data to get updated accounts
        setIsAccountDialogOpen(false)
      }
    } catch (error) {
      console.error('Error creating account:', error)
    }
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
            <CardTitle className="text-2xl font-bold text-gray-900">Manajemen Guru</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Kelola data guru dan informasi pengajar
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-gray-900 hover:bg-gray-800">
            <PlusIcon className="h-4 w-4 mr-2" />
            Tambah Guru
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari guru..."
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

            {/* Gender Filter */}
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Gender</SelectItem>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>

            {/* Position Filter */}
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger>
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jabatan</SelectItem>
                <SelectItem value="Guru">Guru</SelectItem>
                <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                <SelectItem value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <Badge variant="secondary" className="text-sm">
                {filteredTeachers.length} dari {teachers.length} guru
              </Badge>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' || genderFilter !== 'all' || positionFilter !== 'all'
                    ? 'Tidak ada hasil yang ditemukan' 
                    : 'Belum ada data guru'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || genderFilter !== 'all' || positionFilter !== 'all'
                    ? 'Coba ubah filter atau kata kunci pencarian Anda'
                    : 'Mulai dengan menambahkan guru pertama'}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Guru</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">NIP</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Jenis Kelamin</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Jabatan</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Telepon</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-700 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {teacher.nip}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant="outline" 
                          className="border-gray-200 text-gray-700 bg-gray-50"
                        >
                          {teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {teacher.position}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{teacher.phone}</td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant={teacher.status === 'active' ? 'default' : 'secondary'}
                          className={teacher.status === 'active' 
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                          }
                        >
                          {teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-50 hover:border-gray-200"
                            onClick={() => handleView(teacher)}
                          >
                            <EyeIcon className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-50 hover:border-gray-200"
                            onClick={() => handleAccount(teacher)}
                          >
                            <KeyIcon className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-50 hover:border-gray-200"
                            onClick={() => handleEdit(teacher)}
                          >
                            <PenIcon className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:border-red-200"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            <DialogTitle className="text-xl font-semibold">Tambah Guru Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Nama Lengkap</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-nip">NIP</Label>
                <Input
                  id="add-nip"
                  value={formData.nip}
                  onChange={e => setFormData({...formData, nip: e.target.value})}
                  required
                  placeholder="Masukkan NIP"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-phone">Telepon</Label>
                <Input
                  id="add-phone"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="Masukkan nomor telepon"
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
                  placeholder="Masukkan email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-position">Jabatan</Label>
                <Select
                  value={formData.position}
                  onValueChange={value => setFormData({...formData, position: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guru">Guru</SelectItem>
                    <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                    <SelectItem value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-address">Alamat</Label>
              <Input
                id="add-address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
                placeholder="Masukkan alamat lengkap"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                Batal
              </Button>
                              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                  Tambah Guru
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Data Guru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nip">NIP</Label>
                <Input
                  id="edit-nip"
                  value={formData.nip}
                  onChange={e => setFormData({...formData, nip: e.target.value})}
                  required
                  placeholder="Masukkan NIP"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telepon</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="Masukkan nomor telepon"
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
                  placeholder="Masukkan email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-position">Jabatan</Label>
                <Select
                  value={formData.position}
                  onValueChange={value => setFormData({...formData, position: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guru">Guru</SelectItem>
                    <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                    <SelectItem value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Alamat</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
                placeholder="Masukkan alamat lengkap"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                Batal
              </Button>
                              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                  Update Guru
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Detail Guru</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTeacher.name}</h3>
                  <p className="text-gray-500">{selectedTeacher.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">NIP</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedTeacher.nip}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</Label>
                    <Badge 
                      variant="outline" 
                      className={selectedTeacher.gender === 'L' 
                        ? 'border-blue-200 text-blue-700 bg-blue-50' 
                        : 'border-pink-200 text-pink-700 bg-pink-50'
                      }
                    >
                      {selectedTeacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tanggal Lahir</Label>
                    <p className="text-lg text-gray-900">{new Date(selectedTeacher.date_of_birth).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge 
                      variant={selectedTeacher.status === 'active' ? 'default' : 'secondary'}
                      className={selectedTeacher.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {selectedTeacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telepon</Label>
                    <p className="text-lg text-gray-900">{selectedTeacher.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg text-gray-900">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Jabatan</Label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {selectedTeacher.position}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Alamat</Label>
                <p className="text-lg text-gray-900">{selectedTeacher.address}</p>
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

      {/* Account Dialog */}
      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Kelola Akun Guru</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Membuat akun untuk:</p>
                <p className="font-medium text-gray-900">{selectedTeacher.name}</p>
                <p className="text-sm text-gray-500">Guru</p>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const email = formData.get('email') as string
                const password = formData.get('password') as string
                handleCreateAccount(email, password)
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email</Label>
                  <Input
                    id="account-email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-password">Password</Label>
                  <Input
                    id="account-password"
                    name="password"
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                    Buat Akun
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
