'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { 
  getSemesters, 
  createSemester, 
  updateSemester,
  getCurrentSemester 
} from '@/lib/db'
import type { Semester } from '@/lib/types'

interface SemesterFormData {
  name: string
  year: string
  semester_number: number
  start_date: string
  end_date: string
  is_active: boolean
  is_current: boolean
  status: 'active' | 'inactive' | 'archived'
}

export default function SemesterManagement() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<SemesterFormData>({
    name: '',
    year: new Date().getFullYear().toString(),
    semester_number: 1,
    start_date: '',
    end_date: '',
    is_active: true,
    is_current: false,
    status: 'active'
  })

  useEffect(() => {
    loadSemesters()
  }, [])

  const loadSemesters = async () => {
    try {
      setLoading(true)
      const data = await getSemesters()
      setSemesters(data || [])
    } catch (error) {
      console.error('Error loading semesters:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data semester",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      year: new Date().getFullYear().toString(),
      semester_number: 1,
      start_date: '',
      end_date: '',
      is_active: true,
      is_current: false,
      status: 'active'
    })
    setEditingSemester(null)
  }

  const openDialog = (semester?: Semester) => {
    if (semester) {
      setEditingSemester(semester)
      setFormData({
        name: semester.name,
        year: semester.year,
        semester_number: semester.semester_number,
        start_date: semester.start_date,
        end_date: semester.end_date,
        is_active: semester.is_active,
        is_current: semester.is_current,
        status: semester.status
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.year || !formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      if (editingSemester) {
        await updateSemester(editingSemester.id, formData)
        toast({
          title: "Berhasil",
          description: "Semester berhasil diperbarui",
        })
      } else {
        await createSemester(formData)
        toast({
          title: "Berhasil", 
          description: "Semester berhasil ditambahkan",
        })
      }

      await loadSemesters()
      closeDialog()
    } catch (error) {
      console.error('Error saving semester:', error)
      toast({
        title: "Error",
        description: editingSemester ? "Gagal memperbarui semester" : "Gagal menambah semester",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSetCurrent = async (semester: Semester) => {
    try {
      // First, set all semesters to not current
      const updatePromises = semesters.map(s => 
        updateSemester(s.id, { is_current: false })
      )
      await Promise.all(updatePromises)

      // Then set the selected semester as current
      await updateSemester(semester.id, { is_current: true })
      
      await loadSemesters()
      toast({
        title: "Berhasil",
        description: `${semester.name} telah diatur sebagai semester aktif`,
      })
    } catch (error) {
      console.error('Error setting current semester:', error)
      toast({
        title: "Error",
        description: "Gagal mengatur semester aktif",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return <Badge className="bg-green-500">Aktif Sekarang</Badge>
    }
    
    switch (status) {
      case 'active':
        return <Badge variant="secondary">Aktif</Badge>
      case 'inactive':
        return <Badge variant="outline">Tidak Aktif</Badge>
      case 'archived':
        return <Badge variant="destructive">Arsip</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Semester</h2>
          <p className="text-muted-foreground">
            Kelola semester dan tahun ajaran
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Semester
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSemester ? 'Edit Semester' : 'Tambah Semester Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingSemester 
                  ? 'Perbarui informasi semester' 
                  : 'Buat semester baru untuk tahun ajaran'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Semester</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="contoh: Semester Ganjil, Semester Genap"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Tahun Ajaran</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024/2025"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester_number">Nomor Semester</Label>
                  <Select 
                    value={formData.semester_number.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, semester_number: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Tanggal Mulai</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Tanggal Selesai</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' | 'archived' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="archived">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_current"
                  checked={formData.is_current}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_current: checked }))}
                />
                <Label htmlFor="is_current">Semester aktif sekarang</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Batal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Menyimpan...' : editingSemester ? 'Perbarui' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Semester</TableHead>
              <TableHead>Tahun Ajaran</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Belum ada data semester
                </TableCell>
              </TableRow>
            ) : (
              semesters.map((semester) => (
                <TableRow key={semester.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {semester.name}
                    </div>
                  </TableCell>
                  <TableCell>{semester.year}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(semester.start_date).toLocaleDateString('id-ID')} - {' '}
                    {new Date(semester.end_date).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(semester.status, semester.is_current)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(semester)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!semester.is_current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetCurrent(semester)}
                        >
                          Aktifkan
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
