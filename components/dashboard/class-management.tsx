"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, MapPin, User } from "lucide-react"
import { mockClasses, type Class } from "@/lib/mock-data"

export function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    level: "TK A" as "TK A" | "TK B" | "Kelompok Bermain",
    teacherId: "",
    teacherName: "",
    capacity: "",
    ageRange: "",
    schedule: "",
    room: "",
    description: "",
  })

  const handleAddClass = () => {
    const newClass: Class = {
      id: `class${Date.now()}`,
      name: formData.name,
      level: formData.level,
      teacherId: formData.teacherId,
      teacherName: formData.teacherName,
      capacity: Number.parseInt(formData.capacity),
      currentStudents: 0,
      ageRange: formData.ageRange,
      schedule: formData.schedule,
      room: formData.room,
      status: "active",
      description: formData.description,
    }

    setClasses([...classes, newClass])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditClass = () => {
    if (!editingClass) return

    const updatedClass: Class = {
      ...editingClass,
      name: formData.name,
      level: formData.level,
      teacherId: formData.teacherId,
      teacherName: formData.teacherName,
      capacity: Number.parseInt(formData.capacity),
      ageRange: formData.ageRange,
      schedule: formData.schedule,
      room: formData.room,
      description: formData.description,
    }

    setClasses(classes.map((cls) => (cls.id === editingClass.id ? updatedClass : cls)))
    setIsEditDialogOpen(false)
    setEditingClass(null)
    resetForm()
  }

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((cls) => cls.id !== classId))
  }

  const handleEditClick = (cls: Class) => {
    setEditingClass(cls)
    setFormData({
      name: cls.name,
      level: cls.level,
      teacherId: cls.teacherId,
      teacherName: cls.teacherName,
      capacity: cls.capacity.toString(),
      ageRange: cls.ageRange,
      schedule: cls.schedule,
      room: cls.room,
      description: cls.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const toggleClassStatus = (classId: string) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId ? { ...cls, status: cls.status === "active" ? "inactive" : "active" } : cls,
      ),
    )
  }

  const resetForm = () => {
    setFormData({
      name: "",
      level: "TK A",
      teacherId: "",
      teacherName: "",
      capacity: "",
      ageRange: "",
      schedule: "",
      room: "",
      description: "",
    })
  }

  const ClassForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Kelas</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="TK A - Melati"
          />
        </div>
        <div>
          <Label htmlFor="level">Tingkat</Label>
          <Select
            value={formData.level}
            onValueChange={(value: "TK A" | "TK B" | "Kelompok Bermain") => setFormData({ ...formData, level: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TK A">TK A</SelectItem>
              <SelectItem value="TK B">TK B</SelectItem>
              <SelectItem value="Kelompok Bermain">Kelompok Bermain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="teacherName">Nama Guru</Label>
          <Input
            id="teacherName"
            value={formData.teacherName}
            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
            placeholder="Bu Sarah Wijaya"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Kapasitas</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="20"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ageRange">Rentang Usia</Label>
          <Input
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            placeholder="4-5 tahun"
          />
        </div>
        <div>
          <Label htmlFor="room">Ruangan</Label>
          <Input
            id="room"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="Ruang Melati"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="schedule">Jadwal</Label>
        <Input
          id="schedule"
          value={formData.schedule}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          placeholder="Senin-Jumat, 08:00-11:00"
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi kelas..."
          rows={3}
        />
      </div>

      <Button onClick={onSubmit} className="w-full">
        {submitText}
      </Button>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manajemen Kelas
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kelas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Kelas Baru</DialogTitle>
              </DialogHeader>
              <ClassForm onSubmit={handleAddClass} submitText="Tambah Kelas" />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kelas</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead>Kapasitas</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{cls.name}</div>
                    <div className="text-sm text-muted-foreground">{cls.ageRange}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{cls.level}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {cls.teacherName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {cls.currentStudents}/{cls.capacity}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {cls.room}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={cls.status === "active" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleClassStatus(cls.id)}
                  >
                    {cls.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(cls)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteClass(cls.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Kelas</DialogTitle>
            </DialogHeader>
            <ClassForm onSubmit={handleEditClass} submitText="Simpan Perubahan" />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
