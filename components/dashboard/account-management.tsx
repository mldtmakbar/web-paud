"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { User } from "@/lib/auth"

interface AccountFormData {
  email: string
  name: string
  username: string
  password: string
  currentPassword?: string
}

export function AccountManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<AccountFormData>({
    email: "",
    name: "",
    username: "",
    password: "",
  })

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("tk-users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      username: user.username || "",
      password: "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!editingUser) return

    const updatedUsers = users.map((user) => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          email: formData.email,
          name: formData.name,
          username: formData.username,
          ...(formData.password ? { password: formData.password } : {}),
        }
      }
      return user
    })

    setUsers(updatedUsers)
    localStorage.setItem("tk-users", JSON.stringify(updatedUsers))
    toast.success("Akun berhasil diperbarui")
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Akun</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email} • {user.role}
                </div>
                {user.username && (
                  <div className="text-sm text-muted-foreground">
                    Username: {user.username}
                  </div>
                )}
              </div>
              <Button onClick={() => handleEdit(user)} variant="outline">
                Edit Akun
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Akun</DialogTitle>
              <DialogDescription>
                Perbarui informasi akun. Kosongkan password jika tidak ingin mengubahnya.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password Baru (Kosongkan jika tidak diubah)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default AccountManagement
