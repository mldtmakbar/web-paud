'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useToast } from '@/hooks/use-toast'
import { 
  getAssessmentAspects, 
  createAssessmentAspect, 
  updateAssessmentAspect,
  getAssessmentSubAspects,
  createAssessmentSubAspect,
  updateAssessmentSubAspect
} from '@/lib/db'
import type { AssessmentAspect, AssessmentSubAspect } from '@/lib/types'

interface AspectFormData {
  name: string
  code: string
  description: string
  display_order: number
  is_active: boolean
  is_required: boolean
  category: string
}

interface SubAspectFormData {
  aspect_id: string
  name: string
  code: string
  description: string
  display_order: number
  is_active: boolean
}

const CATEGORIES = [
  { value: 'sosial_emosional', label: 'Sosial Emosional' },
  { value: 'kognitif', label: 'Kognitif' },
  { value: 'fisik_motorik', label: 'Fisik Motorik' },
  { value: 'bahasa', label: 'Bahasa' },
  { value: 'agama_moral', label: 'Agama dan Moral' },
  { value: 'seni', label: 'Seni' }
]

export default function AssessmentManagement() {
  const [aspects, setAspects] = useState<AssessmentAspect[]>([])
  const [subAspects, setSubAspects] = useState<AssessmentSubAspect[]>([])
  const [loading, setLoading] = useState(true)
  const [isAspectDialogOpen, setIsAspectDialogOpen] = useState(false)
  const [isSubAspectDialogOpen, setIsSubAspectDialogOpen] = useState(false)
  const [editingAspect, setEditingAspect] = useState<AssessmentAspect | null>(null)
  const [editingSubAspect, setEditingSubAspect] = useState<AssessmentSubAspect | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedAspects, setExpandedAspects] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const [aspectFormData, setAspectFormData] = useState<AspectFormData>({
    name: '',
    code: '',
    description: '',
    display_order: 1,
    is_active: true,
    is_required: false,
    category: 'sosial_emosional'
  })

  const [subAspectFormData, setSubAspectFormData] = useState<SubAspectFormData>({
    aspect_id: '',
    name: '',
    code: '',
    description: '',
    display_order: 1,
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [aspectsData, subAspectsData] = await Promise.all([
        getAssessmentAspects(),
        getAssessmentSubAspects()
      ])
      setAspects(aspectsData || [])
      setSubAspects(subAspectsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data aspek penilaian",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetAspectForm = () => {
    setAspectFormData({
      name: '',
      code: '',
      description: '',
      display_order: aspects.length + 1,
      is_active: true,
      is_required: false,
      category: 'sosial_emosional'
    })
    setEditingAspect(null)
  }

  const resetSubAspectForm = () => {
    setSubAspectFormData({
      aspect_id: '',
      name: '',
      code: '',
      description: '',
      display_order: 1,
      is_active: true
    })
    setEditingSubAspect(null)
  }

  const openAspectDialog = (aspect?: AssessmentAspect) => {
    if (aspect) {
      setEditingAspect(aspect)
      setAspectFormData({
        name: aspect.name,
        code: aspect.code,
        description: aspect.description || '',
        display_order: aspect.display_order,
        is_active: aspect.is_active,
        is_required: aspect.is_required,
        category: aspect.category
      })
    } else {
      resetAspectForm()
    }
    setIsAspectDialogOpen(true)
  }

  const openSubAspectDialog = (subAspect?: AssessmentSubAspect, aspectId?: string) => {
    if (subAspect) {
      setEditingSubAspect(subAspect)
      setSubAspectFormData({
        aspect_id: subAspect.aspect_id,
        name: subAspect.name,
        code: subAspect.code,
        description: subAspect.description || '',
        display_order: subAspect.display_order,
        is_active: subAspect.is_active
      })
    } else {
      resetSubAspectForm()
      if (aspectId) {
        setSubAspectFormData(prev => ({ ...prev, aspect_id: aspectId }))
      }
    }
    setIsSubAspectDialogOpen(true)
  }

  const handleAspectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!aspectFormData.name || !aspectFormData.code) {
      toast({
        title: "Error",
        description: "Nama dan kode aspek harus diisi",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      if (editingAspect) {
        await updateAssessmentAspect(editingAspect.id, aspectFormData)
        toast({
          title: "Berhasil",
          description: "Aspek penilaian berhasil diperbarui",
        })
      } else {
        await createAssessmentAspect(aspectFormData)
        toast({
          title: "Berhasil", 
          description: "Aspek penilaian berhasil ditambahkan",
        })
      }

      await loadData()
      setIsAspectDialogOpen(false)
      resetAspectForm()
    } catch (error) {
      console.error('Error saving aspect:', error)
      toast({
        title: "Error",
        description: editingAspect ? "Gagal memperbarui aspek penilaian" : "Gagal menambah aspek penilaian",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSubAspectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subAspectFormData.name || !subAspectFormData.code || !subAspectFormData.aspect_id) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      if (editingSubAspect) {
        await updateAssessmentSubAspect(editingSubAspect.id, subAspectFormData)
        toast({
          title: "Berhasil",
          description: "Sub aspek berhasil diperbarui",
        })
      } else {
        await createAssessmentSubAspect(subAspectFormData)
        toast({
          title: "Berhasil", 
          description: "Sub aspek berhasil ditambahkan",
        })
      }

      await loadData()
      setIsSubAspectDialogOpen(false)
      resetSubAspectForm()
    } catch (error) {
      console.error('Error saving sub aspect:', error)
      toast({
        title: "Error",
        description: editingSubAspect ? "Gagal memperbarui sub aspek" : "Gagal menambah sub aspek",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleAspectExpansion = (aspectId: string) => {
    const newExpanded = new Set(expandedAspects)
    if (newExpanded.has(aspectId)) {
      newExpanded.delete(aspectId)
    } else {
      newExpanded.add(aspectId)
    }
    setExpandedAspects(newExpanded)
  }

  const getSubAspectsForAspect = (aspectId: string) => {
    return subAspects.filter(sub => sub.aspect_id === aspectId)
  }

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find(cat => cat.value === category)?.label || category
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
          <h2 className="text-2xl font-bold">Manajemen Aspek Penilaian</h2>
          <p className="text-muted-foreground">
            Kelola aspek dan sub aspek penilaian siswa
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isSubAspectDialogOpen} onOpenChange={setIsSubAspectDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => openSubAspectDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Sub Aspek
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSubAspect ? 'Edit Sub Aspek' : 'Tambah Sub Aspek Baru'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubAspectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aspect_id">Aspek Utama</Label>
                  <Select 
                    value={subAspectFormData.aspect_id} 
                    onValueChange={(value) => setSubAspectFormData(prev => ({ ...prev, aspect_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih aspek utama" />
                    </SelectTrigger>
                    <SelectContent>
                      {aspects.map((aspect) => (
                        <SelectItem key={aspect.id} value={aspect.id}>
                          {aspect.name} ({aspect.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_name">Nama Sub Aspek</Label>
                  <Input
                    id="sub_name"
                    value={subAspectFormData.name}
                    onChange={(e) => setSubAspectFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama sub aspek"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_code">Kode Sub Aspek</Label>
                  <Input
                    id="sub_code"
                    value={subAspectFormData.code}
                    onChange={(e) => setSubAspectFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="SE1, K1, dst"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_description">Deskripsi</Label>
                  <Textarea
                    id="sub_description"
                    value={subAspectFormData.description}
                    onChange={(e) => setSubAspectFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi sub aspek"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_display_order">Urutan Tampil</Label>
                  <Input
                    id="sub_display_order"
                    type="number"
                    value={subAspectFormData.display_order}
                    onChange={(e) => setSubAspectFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sub_is_active"
                    checked={subAspectFormData.is_active}
                    onCheckedChange={(checked) => setSubAspectFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="sub_is_active">Aktif</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsSubAspectDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Menyimpan...' : editingSubAspect ? 'Perbarui' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAspectDialogOpen} onOpenChange={setIsAspectDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openAspectDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Aspek
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAspect ? 'Edit Aspek Penilaian' : 'Tambah Aspek Penilaian Baru'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAspectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Aspek</Label>
                  <Input
                    id="name"
                    value={aspectFormData.name}
                    onChange={(e) => setAspectFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama aspek penilaian"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Kode Aspek</Label>
                  <Input
                    id="code"
                    value={aspectFormData.code}
                    onChange={(e) => setAspectFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="SE, K, FM, dst"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select 
                    value={aspectFormData.category} 
                    onValueChange={(value) => setAspectFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={aspectFormData.description}
                    onChange={(e) => setAspectFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi aspek penilaian"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Urutan Tampil</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={aspectFormData.display_order}
                    onChange={(e) => setAspectFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={aspectFormData.is_active}
                      onCheckedChange={(checked) => setAspectFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_required"
                      checked={aspectFormData.is_required}
                      onCheckedChange={(checked) => setAspectFormData(prev => ({ ...prev, is_required: checked }))}
                    />
                    <Label htmlFor="is_required">Wajib</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAspectDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Menyimpan...' : editingAspect ? 'Perbarui' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {aspects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada aspek penilaian yang dibuat
          </div>
        ) : (
          aspects.map((aspect) => {
            const aspectSubAspects = getSubAspectsForAspect(aspect.id)
            const isExpanded = expandedAspects.has(aspect.id)
            
            return (
              <div key={aspect.id} className="border rounded-lg">
                <Collapsible 
                  open={isExpanded} 
                  onOpenChange={() => toggleAspectExpansion(aspect.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{aspect.name}</h3>
                            <Badge variant="outline">{aspect.code}</Badge>
                            <Badge variant="secondary">{getCategoryLabel(aspect.category)}</Badge>
                            {aspect.is_required && (
                              <Badge variant="destructive" className="text-xs">Wajib</Badge>
                            )}
                            {!aspect.is_active && (
                              <Badge variant="outline" className="text-xs">Tidak Aktif</Badge>
                            )}
                          </div>
                          {aspect.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {aspect.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {aspectSubAspects.length} sub aspek
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openSubAspectDialog(undefined, aspect.id)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openAspectDialog(aspect)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="px-4 pb-4">
                    {aspectSubAspects.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Belum ada sub aspek untuk aspek ini
                      </div>
                    ) : (
                      <div className="space-y-2 ml-6">
                        {aspectSubAspects.map((subAspect) => (
                          <div key={subAspect.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{subAspect.name}</span>
                                <Badge variant="outline" className="text-xs">{subAspect.code}</Badge>
                                {!subAspect.is_active && (
                                  <Badge variant="outline" className="text-xs">Tidak Aktif</Badge>
                                )}
                              </div>
                              {subAspect.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {subAspect.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSubAspectDialog(subAspect)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
