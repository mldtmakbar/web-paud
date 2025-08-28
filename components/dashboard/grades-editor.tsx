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
      // For now, we'll load all grades and filter on frontend
      // In production, you might want to create a more specific query
      const allGrades = await Promise.all(
        students.map(student => getStudentGrades(student.id, selectedSemester))
      )
      
      const flatGrades = allGrades.flat()
      const filteredGrades = flatGrades.filter(grade => {
        if (selectedSubAspect) {
          return grade.aspect_id === selectedAspect && grade.sub_aspect_id === selectedSubAspect
        }
        return grade.aspect_id === selectedAspect
      })
      
      setGrades(filteredGrades)
    } catch (error) {
      console.error('Error loading grades:', error)
    }
  }

  const updatePendingGrade = (studentId: string, description: string) => {
    if (!selectedSemester || !selectedAspect) return

    const key = `${studentId}-${selectedAspect}-${selectedSubAspect || 'main'}`
    const gradeData: GradeFormData = {
      student_id: studentId,
      semester_id: selectedSemester,
      aspect_id: selectedAspect,
      sub_aspect_id: selectedSubAspect || undefined,
      description: description,
      assessed_at: new Date().toISOString(),
    }

    const newPendingChanges = new Map(pendingChanges)
    if (description.trim()) {
      newPendingChanges.set(key, gradeData)
    } else {
      newPendingChanges.delete(key)
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
        // Check if grade already exists
        const existingGrade = grades.find(g => 
          g.student_id === gradeData.student_id &&
          g.aspect_id === gradeData.aspect_id &&
          g.sub_aspect_id === gradeData.sub_aspect_id &&
          g.semester_id === gradeData.semester_id
        )

        if (existingGrade) {
          return updateGrade(existingGrade.id, gradeData)
        } else {
          return createGrade(gradeData)
        }
      })

      await Promise.all(promises)
      
      toast({
        title: "Berhasil",
        description: `${pendingChanges.size} nilai berhasil disimpan`,
      })
      
      setPendingChanges(new Map())
      await loadGrades()
    } catch (error) {
      console.error('Error saving grades:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan nilai",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getGradeValue = (studentId: string) => {
    const key = `${studentId}-${selectedAspect}-${selectedSubAspect || 'main'}`
    
    // Check pending changes first
    const pending = pendingChanges.get(key)
    if (pending) {
      return pending.description
    }

    // Then check existing grades
    const existingGrade = grades.find(g => 
      g.student_id === studentId &&
      g.aspect_id === selectedAspect &&
      (selectedSubAspect ? g.sub_aspect_id === selectedSubAspect : !g.sub_aspect_id)
    )
    
    return existingGrade?.description || ""
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
                <h3 className="text-lg font-semibold">
                  Penilaian: {selectedAspectData?.name}
                  {selectedSubAspectData && ` - ${selectedSubAspectData.name}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Semester: {selectedSemesterData?.name} - {selectedSemesterData?.year}
                </p>
              </div>
              <Button onClick={saveGrades} disabled={saving || pendingChanges.size === 0}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Menyimpan...' : `Simpan ${pendingChanges.size > 0 ? `(${pendingChanges.size})` : ''}`}
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
                  <Textarea
                    placeholder={`Masukkan penilaian untuk ${selectedAspectData?.name}${selectedSubAspectData ? ` - ${selectedSubAspectData.name}` : ''}`}
                    value={getGradeValue(student.id)}
                    onChange={(e) => updatePendingGrade(student.id, e.target.value)}
                    className="min-h-[100px]"
                  />
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
