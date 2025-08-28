"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Save, BookOpen, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  getStudents, 
  getSemesters, 
  getAssessmentAspects,
  getAssessmentSubAspects,
  getStudentGrades,
  createGrade,
  updateGrade
} from "@/lib/db"
import { supabase } from "@/lib/supabase"
import type { 
  Student, 
  Semester, 
  AssessmentAspect, 
  AssessmentSubAspect, 
  Grade 
} from "@/lib/types"

interface GradeFormData {
  student_id: string
  semester_id: string
  aspect_id: string
  sub_aspect_id?: string
  description: string
  score?: string
  notes?: string
  assessed_at: string
}

export function GradesEditor() {
  const [students, setStudents] = useState<Student[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [aspects, setAspects] = useState<AssessmentAspect[]>([])
  const [subAspects, setSubAspects] = useState<AssessmentSubAspect[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedAspect, setSelectedAspect] = useState("")
  const [selectedSubAspect, setSelectedSubAspect] = useState("")
  const [pendingChanges, setPendingChanges] = useState<Map<string, GradeFormData>>(new Map())
  
  const { toast } = useToast()

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedAspect) {
      loadSubAspects(selectedAspect)
    } else {
      setSubAspects([])
      setSelectedSubAspect("")
    }
  }, [selectedAspect])

  useEffect(() => {
    if (selectedSemester && selectedAspect) {
      loadGrades()
    }
  }, [selectedSemester, selectedAspect, selectedSubAspect])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [studentsData, semestersData, aspectsData] = await Promise.all([
        getStudents(),
        getSemesters(),
        getAssessmentAspects()
      ])
      
      setStudents(studentsData || [])
      setSemesters(semestersData || [])
      setAspects(aspectsData || [])
      
      // Set default values
      if (semestersData && semestersData.length > 0) {
        const currentSemester = semestersData.find(s => s.is_current) || semestersData[0]
        setSelectedSemester(currentSemester.id)
      }
      
      if (aspectsData && aspectsData.length > 0) {
        setSelectedAspect(aspectsData[0].id)
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSubAspects = async (aspectId: string) => {
    try {
      const subAspectsData = await getAssessmentSubAspects(aspectId)
      setSubAspects(subAspectsData || [])
      if (subAspectsData && subAspectsData.length > 0) {
        setSelectedSubAspect(subAspectsData[0].id)
      }
    } catch (error) {
      console.error('Error loading sub aspects:', error)
    }
  }

  const loadGrades = async () => {
    try {
      if (!selectedSemester || !selectedAspect || students.length === 0) {
        setGrades([])
        return
      }

      // Create a more specific query to get grades for current selection
      const gradePromises = students.map(async (student) => {
        try {
          const studentGrades = await getStudentGrades(student.id, selectedSemester)
          return studentGrades.filter(grade => {
            const matchesAspect = grade.aspect_id === selectedAspect
            const matchesSubAspect = selectedSubAspect 
              ? grade.sub_aspect_id === selectedSubAspect 
              : !grade.sub_aspect_id || grade.sub_aspect_id === null
            
            return matchesAspect && matchesSubAspect
          })
        } catch (error) {
          console.error(`Error loading grades for student ${student.id}:`, error)
          return []
        }
      })
      
      const allGrades = await Promise.all(gradePromises)
      const flatGrades = allGrades.flat()
      
      setGrades(flatGrades)
      
      // Clear pending changes when loading new data
      setPendingChanges(new Map())
    } catch (error) {
      console.error('Error loading grades:', error)
      setGrades([])
    }
  }

  // Helper function to generate consistent pending key
  const getPendingKey = (studentId: string) => {
    return `${studentId}-${selectedAspect}-${selectedSubAspect || 'main'}`
  }

  const updatePendingGrade = (studentId: string, description: string) => {
    if (!selectedSemester || !selectedAspect) return

    const key = getPendingKey(studentId)
    
    // Check if this is actually a change from the original value
    const existingGrade = grades.find(g => 
      g.student_id === studentId &&
      g.aspect_id === selectedAspect &&
      (selectedSubAspect ? g.sub_aspect_id === selectedSubAspect : (!g.sub_aspect_id || g.sub_aspect_id === null))
    )
    
    const originalValue = existingGrade?.description || ""
    
    const newPendingChanges = new Map(pendingChanges)
    
    // If the value is the same as original, remove from pending changes
    if (description === originalValue) {
      newPendingChanges.delete(key)
    } else {
      // Only add to pending if there's actual content or it's different from original
      const gradeData: GradeFormData = {
        student_id: studentId,
        semester_id: selectedSemester,
        aspect_id: selectedAspect,
        sub_aspect_id: selectedSubAspect || undefined,
        description: description,
        assessed_at: new Date().toISOString(),
      }
      
      if (description.trim() || originalValue) {
        newPendingChanges.set(key, gradeData)
      }
    }
    
    setPendingChanges(newPendingChanges)
  }

  const saveGrades = async () => {
    if (pendingChanges.size === 0) {
      toast({
        title: "Info",
        description: "Tidak ada perubahan untuk disimpan",
      })
      return
    }

    try {
      setSaving(true)
      
      const promises = Array.from(pendingChanges.values()).map(async (gradeData) => {
        try {
          // Check if grade already exists
          const existingGrade = grades.find(g => 
            g.student_id === gradeData.student_id &&
            g.aspect_id === gradeData.aspect_id &&
            (gradeData.sub_aspect_id 
              ? g.sub_aspect_id === gradeData.sub_aspect_id 
              : (!g.sub_aspect_id || g.sub_aspect_id === null)
            ) &&
            g.semester_id === gradeData.semester_id
          )

          if (existingGrade) {
            // Update existing grade
            return await updateGrade(existingGrade.id, {
              description: gradeData.description,
              score: gradeData.score,
              notes: gradeData.notes,
              assessed_at: gradeData.assessed_at
            })
          } else {
            // Create new grade only if there's content
            if (gradeData.description.trim()) {
              return await createGrade(gradeData)
            }
          }
        } catch (error) {
          console.error('Error saving individual grade:', error)
          throw error
        }
      })

      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      const successful = results.filter(r => r.status === 'fulfilled').length
      
      if (failed > 0) {
        toast({
          title: "Peringatan",
          description: `${successful} nilai berhasil disimpan, ${failed} gagal`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Berhasil",
          description: `${successful} nilai berhasil disimpan`,
        })
      }
      
      // Clear pending changes and reload grades
      setPendingChanges(new Map())
      await loadGrades()
    } catch (error) {
      console.error('Error saving grades:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan nilai",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getGradeValue = (studentId: string) => {
    const key = getPendingKey(studentId)
    
    // Check pending changes first
    const pending = pendingChanges.get(key)
    if (pending) {
      return pending.description
    }

    // Then check existing grades
    const existingGrade = grades.find(g => 
      g.student_id === studentId &&
      g.aspect_id === selectedAspect &&
      (selectedSubAspect ? g.sub_aspect_id === selectedSubAspect : (!g.sub_aspect_id || g.sub_aspect_id === null))
    )
    
    return existingGrade?.description || ""
  }

  const hasChanges = (studentId: string, newValue: string) => {
    const currentValue = getGradeValue(studentId)
    const existingGrade = grades.find(g => 
      g.student_id === studentId &&
      g.aspect_id === selectedAspect &&
      (selectedSubAspect ? g.sub_aspect_id === selectedSubAspect : (!g.sub_aspect_id || g.sub_aspect_id === null))
    )
    
    const originalValue = existingGrade?.description || ""
    return newValue !== originalValue
  }

  const selectedAspectData = aspects.find(a => a.id === selectedAspect)
  const selectedSubAspectData = subAspects.find(sa => sa.id === selectedSubAspect)
  const selectedSemesterData = semesters.find(s => s.id === selectedSemester)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Input Penilaian Siswa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Semester</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    <div className="flex items-center gap-2">
                      {semester.name} - {semester.year}
                      {semester.is_current && (
                        <Badge variant="default" className="text-xs">Aktif</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Aspek Penilaian</label>
            <Select value={selectedAspect} onValueChange={setSelectedAspect}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih aspek" />
              </SelectTrigger>
              <SelectContent>
                {aspects.map((aspect) => (
                  <SelectItem key={aspect.id} value={aspect.id}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {aspect.name} ({aspect.code})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {subAspects.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Aspek</label>
              <Select value={selectedSubAspect} onValueChange={setSelectedSubAspect}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sub aspek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aspek Utama</SelectItem>
                  {subAspects.map((subAspect) => (
                    <SelectItem key={subAspect.id} value={subAspect.id}>
                      {subAspect.name} ({subAspect.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedSemester && selectedAspect && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Penilaian: {selectedAspectData?.name}
                  {selectedSubAspectData && ` - ${selectedSubAspectData.name}`}
                  {pendingChanges.size > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {pendingChanges.size} perubahan belum disimpan
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Semester: {selectedSemesterData?.name} - {selectedSemesterData?.year}
                </p>
              </div>
              <Button 
                onClick={saveGrades} 
                disabled={saving || pendingChanges.size === 0}
                className={pendingChanges.size > 0 ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Menyimpan...' : 
                  pendingChanges.size > 0 ? 
                    `Simpan Perubahan (${pendingChanges.size})` : 
                    'Simpan'
                }
              </Button>
            </div>

            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">NISN: {student.nisn}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Textarea
                      placeholder={`Masukkan penilaian untuk ${selectedAspectData?.name}${selectedSubAspectData ? ` - ${selectedSubAspectData.name}` : ''}`}
                      value={getGradeValue(student.id)}
                      onChange={(e) => updatePendingGrade(student.id, e.target.value)}
                      className={`min-h-[100px] ${
                        pendingChanges.has(getPendingKey(student.id)) 
                          ? 'border-yellow-400 bg-yellow-50 focus:ring-yellow-500' 
                          : ''
                      }`}
                    />
                    {pendingChanges.has(getPendingKey(student.id)) && (
                      <div className="absolute top-2 right-2 text-yellow-600">
                        <span className="text-xs font-medium bg-yellow-100 px-2 py-1 rounded">
                          Belum disimpan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {students.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada data siswa</p>
              </div>
            )}
          </div>
        )}

        {(!selectedSemester || !selectedAspect) && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Pilih semester dan aspek penilaian untuk mulai input nilai</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
