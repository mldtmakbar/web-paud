import { useState, useEffect } from 'react'
import type { Student, Class } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Pen as PenIcon, Trash as TrashIcon, PlusIcon, EyeIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getStudents, addStudent, updateStudent, deleteStudent, getClasses } from '@/lib/database'

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  
  const initialFormData = {
    name: '',
    birth_date: '',
    gender: '',
    class_id: null as string | null,
    nisn: '',
    blood_type: '',
    allergies: '',
    emergency_contact: '',
    emergency_phone: '',
    father_name: '',
    father_occupation: '',
    father_work_address: '',
    father_phone: '',
    father_email: '',
    mother_name: '',
    mother_occupation: '',
    mother_work_address: '',
    mother_phone: '',
    mother_email: '',
    home_address: '',
    status: 'active'
  }
  
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [studentsData, classesData] = await Promise.all([
        getStudents(),
        getClasses()
      ])
      setStudents(studentsData)
      setClasses(classesData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setIsLoading(false)
  }

  async function loadStudents() {
    setIsLoading(true)
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      return
    }
    try {
      await deleteStudent(id)
      await loadStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Gagal menghapus data siswa')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const dataToSubmit = {
        ...formData,
        class_id: formData.class_id || null
      }

      if (selectedStudent) {
        await updateStudent(selectedStudent.id, dataToSubmit)
      } else {
        await addStudent(dataToSubmit)
      }
      await loadStudents()
      handleCloseDialogs()
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  function handleEdit(student: Student) {
    setSelectedStudent(student)
    setFormData({
      name: student.name,
      birth_date: student.birth_date,
      gender: student.gender,
      class_id: student.class_id,
      nisn: student.nisn || '',
      blood_type: student.blood_type || '',
      allergies: student.allergies || '',
      emergency_contact: student.emergency_contact || '',
      emergency_phone: student.emergency_phone || '',
      father_name: student.father_name || '',
      father_occupation: student.father_occupation || '',
      father_work_address: student.father_work_address || '',
      father_phone: student.father_phone || '',
      father_email: student.father_email || '',
      mother_name: student.mother_name || '',
      mother_occupation: student.mother_occupation || '',
      mother_work_address: student.mother_work_address || '',
      mother_phone: student.mother_phone || '',
      mother_email: student.mother_email || '',
      home_address: student.home_address,
      status: student.status
    })
    setIsEditDialogOpen(true)
  }

  function handleView(student: Student) {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
  }

  function handleAdd() {
    setSelectedStudent(null)
    setFormData(initialFormData)
    setIsAddDialogOpen(true)
  }

  function handleCloseDialogs() {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsViewDialogOpen(false)
    setSelectedStudent(null)
    setFormData(initialFormData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Siswa</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Tambah Siswa
        </Button>
      </div>

      <div className="grid gap-4">
        {students.length === 0 ? (
          <div className="text-center py-8">
            <p>Belum ada data siswa</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left">NISN</th>
                  <th className="py-2 px-4 text-left">Nama</th>
                  <th className="py-2 px-4 text-left">Jenis Kelamin</th>
                  <th className="py-2 px-4 text-left">Tanggal Lahir</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="py-2 px-4">{student.nisn}</td>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">
                      {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(student.birth_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-2 px-4">
                      {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(student)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(student)}
                        >
                          <PenIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-500 hover:border-red-500"
                          onClick={() => handleDelete(student.id)}
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tambah Siswa Baru</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
              <TabsTrigger value="medical">Data Medis</TabsTrigger>
              <TabsTrigger value="parents">Data Orang Tua</TabsTrigger>
              <TabsTrigger value="address">Alamat</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="add-class_id">Kelas</Label>
                    <Select
                      value={formData.class_id || undefined}
                      onValueChange={value => setFormData({...formData, class_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-nisn">NISN</Label>
                    <Input
                      id="add-nisn"
                      value={formData.nisn}
                      onChange={e => setFormData({...formData, nisn: e.target.value})}
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
                    <Label htmlFor="add-birth_date">Tanggal Lahir</Label>
                    <Input
                      id="add-birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={e => setFormData({...formData, birth_date: e.target.value})}
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
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-blood_type">Golongan Darah</Label>
                    <Input
                      id="add-blood_type"
                      value={formData.blood_type}
                      onChange={e => setFormData({...formData, blood_type: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-allergies">Alergi</Label>
                    <Input
                      id="add-allergies"
                      value={formData.allergies}
                      onChange={e => setFormData({...formData, allergies: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-emergency_contact">Kontak Darurat</Label>
                    <Input
                      id="add-emergency_contact"
                      value={formData.emergency_contact}
                      onChange={e => setFormData({...formData, emergency_contact: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-emergency_phone">No. Telp Darurat</Label>
                    <Input
                      id="add-emergency_phone"
                      value={formData.emergency_phone}
                      onChange={e => setFormData({...formData, emergency_phone: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parents" className="mt-4">
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Ayah</h3>
                    <div className="space-y-2">
                      <Label htmlFor="add-father_name">Nama Ayah</Label>
                      <Input
                        id="add-father_name"
                        value={formData.father_name}
                        onChange={e => setFormData({...formData, father_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-father_occupation">Pekerjaan Ayah</Label>
                      <Input
                        id="add-father_occupation"
                        value={formData.father_occupation}
                        onChange={e => setFormData({...formData, father_occupation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-father_phone">No. Telp Ayah</Label>
                      <Input
                        id="add-father_phone"
                        value={formData.father_phone}
                        onChange={e => setFormData({...formData, father_phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-father_email">Email Ayah</Label>
                      <Input
                        id="add-father_email"
                        value={formData.father_email}
                        onChange={e => setFormData({...formData, father_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Data Ibu</h3>
                    <div className="space-y-2">
                      <Label htmlFor="add-mother_name">Nama Ibu</Label>
                      <Input
                        id="add-mother_name"
                        value={formData.mother_name}
                        onChange={e => setFormData({...formData, mother_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-mother_occupation">Pekerjaan Ibu</Label>
                      <Input
                        id="add-mother_occupation"
                        value={formData.mother_occupation}
                        onChange={e => setFormData({...formData, mother_occupation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-mother_phone">No. Telp Ibu</Label>
                      <Input
                        id="add-mother_phone"
                        value={formData.mother_phone}
                        onChange={e => setFormData({...formData, mother_phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-mother_email">Email Ibu</Label>
                      <Input
                        id="add-mother_email"
                        value={formData.mother_email}
                        onChange={e => setFormData({...formData, mother_email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-home_address">Alamat Rumah</Label>
                    <Input
                      id="add-home_address"
                      value={formData.home_address}
                      onChange={e => setFormData({...formData, home_address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-father_work_address">Alamat Kerja Ayah</Label>
                    <Input
                      id="add-father_work_address"
                      value={formData.father_work_address}
                      onChange={e => setFormData({...formData, father_work_address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-mother_work_address">Alamat Kerja Ibu</Label>
                    <Input
                      id="add-mother_work_address"
                      value={formData.mother_work_address}
                      onChange={e => setFormData({...formData, mother_work_address: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                  Batal
                </Button>
                <Button type="submit">Tambah Siswa</Button>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Data Siswa</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
              <TabsTrigger value="medical">Data Medis</TabsTrigger>
              <TabsTrigger value="parents">Data Orang Tua</TabsTrigger>
              <TabsTrigger value="address">Alamat</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="edit-class_id">Kelas</Label>
                    <Select
                      value={formData.class_id || undefined}
                      onValueChange={value => setFormData({...formData, class_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-nisn">NISN</Label>
                    <Input
                      id="edit-nisn"
                      value={formData.nisn}
                      onChange={e => setFormData({...formData, nisn: e.target.value})}
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
                    <Label htmlFor="edit-birth_date">Tanggal Lahir</Label>
                    <Input
                      id="edit-birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={e => setFormData({...formData, birth_date: e.target.value})}
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
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-blood_type">Golongan Darah</Label>
                    <Input
                      id="edit-blood_type"
                      value={formData.blood_type}
                      onChange={e => setFormData({...formData, blood_type: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-allergies">Alergi</Label>
                    <Input
                      id="edit-allergies"
                      value={formData.allergies}
                      onChange={e => setFormData({...formData, allergies: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-emergency_contact">Kontak Darurat</Label>
                    <Input
                      id="edit-emergency_contact"
                      value={formData.emergency_contact}
                      onChange={e => setFormData({...formData, emergency_contact: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-emergency_phone">No. Telp Darurat</Label>
                    <Input
                      id="edit-emergency_phone"
                      value={formData.emergency_phone}
                      onChange={e => setFormData({...formData, emergency_phone: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parents" className="mt-4">
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Ayah</h3>
                    <div className="space-y-2">
                      <Label htmlFor="edit-father_name">Nama Ayah</Label>
                      <Input
                        id="edit-father_name"
                        value={formData.father_name}
                        onChange={e => setFormData({...formData, father_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-father_occupation">Pekerjaan Ayah</Label>
                      <Input
                        id="edit-father_occupation"
                        value={formData.father_occupation}
                        onChange={e => setFormData({...formData, father_occupation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-father_phone">No. Telp Ayah</Label>
                      <Input
                        id="edit-father_phone"
                        value={formData.father_phone}
                        onChange={e => setFormData({...formData, father_phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-father_email">Email Ayah</Label>
                      <Input
                        id="edit-father_email"
                        value={formData.father_email}
                        onChange={e => setFormData({...formData, father_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Data Ibu</h3>
                    <div className="space-y-2">
                      <Label htmlFor="edit-mother_name">Nama Ibu</Label>
                      <Input
                        id="edit-mother_name"
                        value={formData.mother_name}
                        onChange={e => setFormData({...formData, mother_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-mother_occupation">Pekerjaan Ibu</Label>
                      <Input
                        id="edit-mother_occupation"
                        value={formData.mother_occupation}
                        onChange={e => setFormData({...formData, mother_occupation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-mother_phone">No. Telp Ibu</Label>
                      <Input
                        id="edit-mother_phone"
                        value={formData.mother_phone}
                        onChange={e => setFormData({...formData, mother_phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-mother_email">Email Ibu</Label>
                      <Input
                        id="edit-mother_email"
                        value={formData.mother_email}
                        onChange={e => setFormData({...formData, mother_email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-home_address">Alamat Rumah</Label>
                    <Input
                      id="edit-home_address"
                      value={formData.home_address}
                      onChange={e => setFormData({...formData, home_address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-father_work_address">Alamat Kerja Ayah</Label>
                    <Input
                      id="edit-father_work_address"
                      value={formData.father_work_address}
                      onChange={e => setFormData({...formData, father_work_address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-mother_work_address">Alamat Kerja Ibu</Label>
                    <Input
                      id="edit-mother_work_address"
                      value={formData.mother_work_address}
                      onChange={e => setFormData({...formData, mother_work_address: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialogs}>
                  Batal
                </Button>
                <Button type="submit">Update Siswa</Button>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                  <TabsTrigger value="medical">Data Medis</TabsTrigger>
                  <TabsTrigger value="parents">Data Orang Tua</TabsTrigger>
                  <TabsTrigger value="address">Alamat</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">NISN</Label>
                      <p className="text-sm">{selectedStudent.nisn || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                      <p className="text-sm">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</Label>
                      <p className="text-sm">{selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tanggal Lahir</Label>
                      <p className="text-sm">{new Date(selectedStudent.birth_date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <p className="text-sm">{selectedStudent.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Golongan Darah</Label>
                      <p className="text-sm">{selectedStudent.blood_type || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Alergi</Label>
                      <p className="text-sm">{selectedStudent.allergies || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Kontak Darurat</Label>
                      <p className="text-sm">{selectedStudent.emergency_contact || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">No. Telp Darurat</Label>
                      <p className="text-sm">{selectedStudent.emergency_phone || '-'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parents" className="mt-4">
                  <div className="grid grid-cols-2 gap-x-8">
                    <div className="space-y-4">
                      <h3 className="font-medium">Data Ayah</h3>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Nama Ayah</Label>
                        <p className="text-sm">{selectedStudent.father_name || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Pekerjaan Ayah</Label>
                        <p className="text-sm">{selectedStudent.father_occupation || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">No. Telp Ayah</Label>
                        <p className="text-sm">{selectedStudent.father_phone || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email Ayah</Label>
                        <p className="text-sm">{selectedStudent.father_email || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Data Ibu</h3>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Nama Ibu</Label>
                        <p className="text-sm">{selectedStudent.mother_name || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Pekerjaan Ibu</Label>
                        <p className="text-sm">{selectedStudent.mother_occupation || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">No. Telp Ibu</Label>
                        <p className="text-sm">{selectedStudent.mother_phone || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email Ibu</Label>
                        <p className="text-sm">{selectedStudent.mother_email || '-'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Alamat Rumah</Label>
                      <p className="text-sm">{selectedStudent.home_address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Alamat Kerja Ayah</Label>
                      <p className="text-sm">{selectedStudent.father_work_address || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Alamat Kerja Ibu</Label>
                      <p className="text-sm">{selectedStudent.mother_work_address || '-'}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
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
