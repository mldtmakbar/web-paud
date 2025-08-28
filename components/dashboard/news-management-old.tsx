"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus, Edit, Trash2, Search, Eye, Calendar, User, Star, StarOff } from "lucide-react"
import { mockNews, type News } from "@/lib/mock-data"

export function NewsManagement() {
  const [news, setNews] = useState<News[]>(mockNews)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    image: "",
    tags: "",
    featured: false,
    status: "draft" as "published" | "draft" | "archived",
  })

  const filteredNews = news.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newsData: News = {
      id: editingNews ? editingNews.id : `news${Date.now()}`,
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      author: formData.author,
      publishDate: editingNews ? editingNews.publishDate : new Date().toISOString().split("T")[0],
      status: formData.status,
      category: formData.category,
      image: formData.image || `/placeholder.svg?height=300&width=600&query=${encodeURIComponent(formData.title)}`,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      views: editingNews ? editingNews.views : 0,
      featured: formData.featured,
    }

    if (editingNews) {
      setNews(news.map((article) => (article.id === editingNews.id ? newsData : article)))
      setIsEditDialogOpen(false)
    } else {
      setNews([...news, newsData])
      setIsAddDialogOpen(false)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      image: "",
      tags: "",
      featured: false,
      status: "draft",
    })
    setEditingNews(null)
  }

  const handleEdit = (article: News) => {
    setEditingNews(article)
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      image: article.image || "",
      tags: article.tags.join(", "),
      featured: article.featured,
      status: article.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      setNews(news.filter((article) => article.id !== id))
    }
  }

  const toggleFeatured = (id: string) => {
    setNews(news.map((article) => (article.id === id ? { ...article, featured: !article.featured } : article)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Dipublikasi</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Diarsipkan</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const NewsForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Judul Artikel</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pengumuman">Pengumuman</SelectItem>
              <SelectItem value="Kegiatan">Kegiatan</SelectItem>
              <SelectItem value="Perayaan">Perayaan</SelectItem>
              <SelectItem value="Prestasi">Prestasi</SelectItem>
              <SelectItem value="Informasi">Informasi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Penulis</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "published" | "draft" | "archived") => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Dipublikasi</SelectItem>
              <SelectItem value="archived">Diarsipkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Ringkasan</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Ringkasan singkat artikel..."
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Konten Artikel</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Tulis konten artikel lengkap di sini..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="image">URL Gambar</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg (opsional)"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
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
        <Label htmlFor="featured">Artikel Unggulan</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
          }}
        >
          Batal
        </Button>
        <Button type="submit">{editingNews ? "Update" : "Tambah"} Artikel</Button>
      </div>
    </form>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manajemen Berita & Artikel
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Artikel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Artikel Baru</DialogTitle>
              </DialogHeader>
              <NewsForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Unggulan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{article.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{article.excerpt}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>{new Date(article.publishDate).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleFeatured(article.id)}>
                      {article.featured ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Artikel</DialogTitle>
            </DialogHeader>
            <NewsForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
