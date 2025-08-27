"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Edit, Trash2, GraduationCap, Key } from "lucide-react"
import { toast } from "sonner"
import { DialogFooter } from "@/components/ui/dialog"
import { mockStudents, mockParents, type Student } from "@/lib/mock-data"

interface ExtendedStudent extends Student {
  // Parent information
  nama_ayah: string
  pekerjaan_ayah: string
  alamat_pekerjaan_ayah: string
  nomor_telepon_ayah: string
  email_ayah: string
  nama_ibu: string
  pekerjaan_ibu: string
  alamat_pekerjaan_ibu: string
  nomor_telepon_ibu: string
  email_ibu: string
  alamat_rumah: string
}

export function StudentManagement() {
  const [students, setStudents] = useState<ExtendedStudent[]>(
    mockStudents.map((student) => {
      const parent = mockParents.find((p) => p.id_siswa === student.id)
      return {
        ...student,
        nama_ayah: parent?.nama_ayah || "",
        pekerjaan_ayah: parent?.pekerjaan_ayah || "",
        alamat_pekerjaan_ayah: parent?.alamat_pekerjaan_ayah || "",
        nomor_telepon_ayah: parent?.nomor_telepon_ayah || "",
        email_ayah: parent?.email_ayah || "",
        nama_ibu: parent?.nama_ibu || "",
        pekerjaan_ibu: parent?.pekerjaan_ibu || "",
        alamat_pekerjaan_ibu: parent?.alamat_pekerjaan_ibu || "",
        nomor_telepon_ibu: parent?.nomor_telepon_ibu || "",
        email_ibu: parent?.email_ibu || "",
        alamat_rumah: parent?.alamat_rumah || student.address,
      }
    }),
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<ExtendedStudent | null>(null)
  const [accountData, setAccountData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    class: "",
    dateOfBirth: "",
    gender: "L" as "L" | "P",
    nisn: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",
    // Father information
    nama_ayah: "",
    pekerjaan_ayah: "",
    alamat_pekerjaan_ayah: "",
    nomor_telepon_ayah: "",
    email_ayah: "",
    // Mother information (required fields)
    nama_ibu: "",
    pekerjaan_ibu: "",
    alamat_pekerjaan_ibu: "",
    nomor_telepon_ibu: "",
    email_ibu: "",
    // Home address
    alamat_rumah: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingStudent) {
      // Update existing student
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingStudent.id ? { ...student, ...formData, address: formData.alamat_rumah } : student,
        ),
      )
    } else {
      // Add new student
      const newStudent: ExtendedStudent = {
        id: Date.now().toString(),
        name: formData.name,
        class: formData.class,
        dateOfBirth: formData.dateOfBirth,
        parentId: Date.now().toString(),
        photo: "/student-profile-photo-kindergarten-boy.png",
        nisn: formData.nisn,
        gender: formData.gender,
        address: formData.alamat_rumah,
        bloodType: formData.bloodType,
        allergies: formData.allergies,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        status: "active",
        enrollmentDate: new Date().toISOString().split("T")[0],
        // Parent information
        nama_ayah: formData.nama_ayah,
        pekerjaan_ayah: formData.pekerjaan_ayah,
        alamat_pekerjaan_ayah: formData.alamat_pekerjaan_ayah,
        nomor_telepon_ayah: formData.nomor_telepon_ayah,
        email_ayah: formData.email_ayah,
        nama_ibu: formData.nama_ibu,
        pekerjaan_ibu: formData.pekerjaan_ibu,
        alamat_pekerjaan_ibu: formData.alamat_pekerjaan_ibu,
        nomor_telepon_ibu: formData.nomor_telepon_ibu,
        email_ibu: formData.email_ibu,
        alamat_rumah: formData.alamat_rumah,
      }
      setStudents((prev) => [...prev, newStudent])
    }

    // Reset form
    setFormData({
      name: "",
      class: "",
      dateOfBirth: "",
      gender: "L",
      nisn: "",
      bloodType: "",
      allergies: "",
      emergencyContact: "",
      emergencyPhone: "",
      nama_ayah: "",
      pekerjaan_ayah: "",
      alamat_pekerjaan_ayah: "",
      nomor_telepon_ayah: "",
      email_ayah: "",
      nama_ibu: "",
      pekerjaan_ibu: "",
      alamat_pekerjaan_ibu: "",
      nomor_telepon_ibu: "",
      email_ibu: "",
      alamat_rumah: "",
    })
    setEditingStudent(null)
    setIsDialogOpen(false)
    toast.success(editingStudent ? "Data siswa berhasil diperbarui" : "Siswa baru berhasil ditambahkan")
  }

  const handleEdit = (student: ExtendedStudent) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      class: student.class,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      nisn: student.nisn || "",
      bloodType: student.bloodType || "",
      allergies: student.allergies || "",
      emergencyContact: student.emergencyContact,
      emergencyPhone: student.emergencyPhone,
      nama_ayah: student.nama_ayah,
      pekerjaan_ayah: student.pekerjaan_ayah,
      alamat_pekerjaan_ayah: student.alamat_pekerjaan_ayah,
      nomor_telepon_ayah: student.nomor_telepon_ayah,
      email_ayah: student.email_ayah,
      nama_ibu: student.nama_ibu,
      pekerjaan_ibu: student.pekerjaan_ibu,
      alamat_pekerjaan_ibu: student.alamat_pekerjaan_ibu,
      nomor_telepon_ibu: student.nomor_telepon_ibu,
      email_ibu: student.email_ibu,
      alamat_rumah: student.alamat_rumah,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
    toast.success("Data siswa berhasil dihapus")
  }

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: student.status === "active" ? "inactive" : "active" } : student,
      ),
    )
  }

  const handleEditAccount = (student: ExtendedStudent) => {
    setEditingStudent(student)
    const mockParent = mockParents.find(p => p.id_siswa === student.id)
    setAccountData({
      username: mockParent?.username || "",
      password: "",
      confirmPassword: "",
    })
    setIsAccountDialogOpen(true)
  }

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStudent) return

    if (accountData.password && accountData.password !== accountData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok")
      return
    }

    const parentIndex = mockParents.findIndex(p => p.id_siswa === editingStudent.id)
    if (parentIndex >= 0) {
      mockParents[parentIndex] = {
        ...mockParents[parentIndex],
        username: accountData.username,
        ...(accountData.password ? { password: accountData.password } : {})
      }
    }

    setIsAccountDialogOpen(false)
    setAccountData({ username: "", password: "", confirmPassword: "" })
    toast.success("Akun orang tua berhasil diperbarui")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Manajemen Siswa
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingStudent ? "Edit Siswa" : "Tambah Siswa Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Informasi Siswa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Siswa *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="class">Kelas *</Label>
                      <Select
                        value={formData.class}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, class: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TK A">TK A</SelectItem>
                          <SelectItem value="TK B">TK B</SelectItem>
                          <SelectItem value="Kelompok Bermain">Kelompok Bermain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Tanggal Lahir *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Jenis Kelamin *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: "L" | "P") => setFormData((prev) => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nisn">NISN</Label>
                      <Input
                        id="nisn"
                        value={formData.nisn}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nisn: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodType">Golongan Darah</Label>
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih golongan darah" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="allergies">Alergi</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                        placeholder="Contoh: Kacang, Susu, dll"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Kontak Darurat *</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Telepon Darurat *</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, emergencyPhone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Father Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Informasi Ayah</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama_ayah">Nama Ayah</Label>
                      <Input
                        id="nama_ayah"
                        value={formData.nama_ayah}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nama_ayah: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                      <Input
                        id="pekerjaan_ayah"
                        value={formData.pekerjaan_ayah}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pekerjaan_ayah: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="alamat_pekerjaan_ayah">Alamat Pekerjaan Ayah</Label>
                    <Textarea
                      id="alamat_pekerjaan_ayah"
                      value={formData.alamat_pekerjaan_ayah}
                      onChange={(e) => setFormData((prev) => ({ ...prev, alamat_pekerjaan_ayah: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomor_telepon_ayah">Nomor Telepon Ayah</Label>
                      <Input
                        id="nomor_telepon_ayah"
                        value={formData.nomor_telepon_ayah}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nomor_telepon_ayah: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email_ayah">Email Ayah</Label>
                      <Input
                        id="email_ayah"
                        type="email"
                        value={formData.email_ayah}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email_ayah: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Mother Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Informasi Ibu</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama_ibu">Nama Ibu *</Label>
                      <Input
                        id="nama_ibu"
                        value={formData.nama_ibu}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nama_ibu: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                      <Input
                        id="pekerjaan_ibu"
                        value={formData.pekerjaan_ibu}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pekerjaan_ibu: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="alamat_pekerjaan_ibu">Alamat Pekerjaan Ibu</Label>
                    <Textarea
                      id="alamat_pekerjaan_ibu"
                      value={formData.alamat_pekerjaan_ibu}
                      onChange={(e) => setFormData((prev) => ({ ...prev, alamat_pekerjaan_ibu: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomor_telepon_ibu">Nomor Telepon Ibu *</Label>
                      <Input
                        id="nomor_telepon_ibu"
                        value={formData.nomor_telepon_ibu}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nomor_telepon_ibu: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email_ibu">Email Ibu</Label>
                      <Input
                        id="email_ibu"
                        type="email"
                        value={formData.email_ibu}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email_ibu: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Home Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Alamat Rumah</h3>
                  <div>
                    <Label htmlFor="alamat_rumah">Alamat Lengkap *</Label>
                    <Textarea
                      id="alamat_rumah"
                      value={formData.alamat_rumah}
                      onChange={(e) => setFormData((prev) => ({ ...prev, alamat_rumah: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">{editingStudent ? "Update" : "Tambah"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Orang Tua</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">Ayah: {student.nama_ayah || "-"}</div>
                    <div className="font-medium">Ibu: {student.nama_ibu}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{student.nomor_telepon_ibu}</div>
                    <div className="text-muted-foreground">{student.email_ibu || student.email_ayah}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={student.status === "active" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(student.id)}
                  >
                    {student.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(student.enrollmentDate).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditAccount(student)}>
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Account Management Dialog */}
        <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pengaturan Akun Orang Tua</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <Label htmlFor="parent-username">Username</Label>
                <Input
                  id="parent-username"
                  value={accountData.username}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="parent-password">Password Baru (Kosongkan jika tidak diubah)</Label>
                <Input
                  id="parent-password"
                  type="password"
                  value={accountData.password}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="parent-confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="parent-confirmPassword"
                  type="password"
                  value={accountData.confirmPassword}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
