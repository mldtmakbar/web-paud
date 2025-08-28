"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Search, Calendar, User, Star, StarOff } from "lucide-react"
import { News } from "@/lib/types"
import { getNews, addNews, updateNews, deleteNews } from "@/lib/news"
import { useAuth } from "@/contexts/auth-context"

export function NewsManagement() {
  const [news, setNews] = useState<News[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    image: "",
    tags: "",
    featured: false,
    status: "draft" as "published" | "draft" | "archived",
    publish_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setIsLoading(true)
      const newsData = await getNews(100) // Load more news for admin
      setNews(newsData)
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNews = news.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      console.error('No user logged in')
      return
    }

    try {
      const newsData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author_id: user.id,
        category: formData.category,
        image: formData.image,
        tags: formData.tags,
        featured: formData.featured,
        status: formData.status,
        publish_date: formData.publish_date
      }

      if (editingNews) {
        await updateNews(editingNews.id, newsData)
      } else {
        await addNews(newsData)
      }

      await loadNews()
      resetForm()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  const handleEdit = (article: News) => {
    setEditingNews(article)
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      image: article.image,
      tags: article.tags,
      featured: article.featured,
      status: article.status,
      publish_date: article.publish_date.split('T')[0]
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await deleteNews(id)
        await loadNews()
      } catch (error) {
        console.error('Error deleting news:', error)
      }
    }
  }

  const toggleFeatured = async (article: News) => {
    try {
      await updateNews(article.id, { featured: !article.featured })
      await loadNews()
    } catch (error) {
      console.error('Error toggling featured:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      image: "",
      tags: "",
      featured: false,
      status: "draft",
      publish_date: new Date().toISOString().split('T')[0]
    })
    setEditingNews(null)
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Pendaftaran: "bg-blue-100 text-blue-800",
      Kegiatan: "bg-green-100 text-green-800",
      Workshop: "bg-purple-100 text-purple-800",
      Prestasi: "bg-yellow-100 text-yellow-800",
      Perayaan: "bg-pink-100 text-pink-800",
      Program: "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Berita</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Berita Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendaftaran">Pendaftaran</SelectItem>
                      <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Prestasi">Prestasi</SelectItem>
                      <SelectItem value="Perayaan">Perayaan</SelectItem>
                      <SelectItem value="Program">Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="publish_date">Tanggal Publikasi</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">URL Gambar</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Berita Unggulan</Label>
              </div>

              <Button type="submit" className="w-full">Simpan Berita</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita ({filteredNews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Unggulan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{article.title}</div>
                      <div className="text-sm text-gray-500 truncate">{article.excerpt}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.users?.name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(article.status)}>
                        {article.status === 'published' ? 'Terbit' : article.status === 'draft' ? 'Draft' : 'Arsip'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.publish_date).toLocaleDateString('id-ID')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeatured(article)}
                      >
                        {article.featured ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Berita</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Judul</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-excerpt">Ringkasan</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-content">Konten</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendaftaran">Pendaftaran</SelectItem>
                    <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Prestasi">Prestasi</SelectItem>
                    <SelectItem value="Perayaan">Perayaan</SelectItem>
                    <SelectItem value="Program">Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-publish_date">Tanggal Publikasi</Label>
              <Input
                id="edit-publish_date"
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-image">URL Gambar</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags (pisahkan dengan koma)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="edit-featured">Berita Unggulan</Label>
            </div>

            <Button type="submit" className="w-full">Update Berita</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
