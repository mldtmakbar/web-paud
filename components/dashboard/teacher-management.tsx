"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Edit, Trash2, Users, Key } from "lucide-react"
import { toast } from "sonner"
import { DialogFooter } from "@/components/ui/dialog"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  status: "active" | "inactive"
  joinDate: string
  username?: string
  password?: string
}

const initialTeachers: Teacher[] = [
  {
    id: "1",
    name: "Bu Sarah Wijaya",
    email: "sarah@tkceria.com",
    phone: "081234567890",
    subject: "Bahasa Indonesia",
    status: "active",
    joinDate: "2023-01-15",
    username: "sarah",
  },
  {
    id: "2",
    name: "Bu Maya Sari",
    email: "maya@tkceria.com",
    phone: "081234567891",
    subject: "Matematika",
    status: "active",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Bu Rina Putri",
    email: "rina@tkceria.com",
    phone: "081234567892",
    subject: "Seni dan Kreativitas",
    status: "inactive",
    joinDate: "2023-03-10",
  },
]

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  })
  const [accountData, setAccountData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTeacher) {
      // Update existing teacher
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === editingTeacher.id ? { ...teacher, ...formData } : teacher)),
      )
    } else {
      // Add new teacher
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
      }
      setTeachers((prev) => [...prev, newTeacher])
    }

    setFormData({ name: "", email: "", phone: "", subject: "" })
    setEditingTeacher(null)
    setIsDialogOpen(false)
    toast.success(editingTeacher ? "Data guru berhasil diperbarui" : "Guru baru berhasil ditambahkan")
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id))
    toast.success("Data guru berhasil dihapus")
  }

  const toggleStatus = (id: string) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, status: teacher.status === "active" ? "inactive" : "active" } : teacher,
      ),
    )
  }

  const handleEditAccount = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setAccountData({
      username: teacher.username || "",
      password: "",
      confirmPassword: "",
    })
    setIsAccountDialogOpen(true)
  }

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTeacher) return

    if (accountData.password && accountData.password !== accountData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok")
      return
    }

    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id === editingTeacher.id) {
          return {
            ...teacher,
            username: accountData.username,
            ...(accountData.password ? { password: accountData.password } : {}),
          }
        }
        return teacher
      })
    )

    setIsAccountDialogOpen(false)
    setAccountData({ username: "", password: "", confirmPassword: "" })
    toast.success("Akun guru berhasil diperbarui")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manajemen Guru
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Tambah Guru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTeacher ? "Edit Guru" : "Tambah Guru Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">{editingTeacher ? "Update" : "Tambah"}</Button>
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
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Bergabung</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>
                  <Badge
                    variant={teacher.status === "active" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(teacher.id)}
                  >
                    {teacher.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(teacher.joinDate).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{teacher.username || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(teacher)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditAccount(teacher)}>
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(teacher.id)}>
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
              <DialogTitle>Pengaturan Akun Guru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={accountData.username}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password Baru (Kosongkan jika tidak diubah)</Label>
                <Input
                  id="password"
                  type="password"
                  value={accountData.password}
                  onChange={(e) => setAccountData((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
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
