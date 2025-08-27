"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Save } from "lucide-react"
import { mockStudents } from "@/lib/mock-data"

interface Grade {
  studentId: string
  subject: string
  description: string
  semester: string
}

const subjects = [
  "Nilai Agama dan Budi Pekerti",
  "Jati Diri",
  "Literasi",
  "Numerasi",
  "Sains dan Teknologi",
  "Seni dan Budaya",
  "Kesehatan dan Olahraga",
]

const semesters = ["Semester 1 - 2024/2025", "Semester 2 - 2024/2025"]

export function GradesEditor() {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("Semester 1 - 2024/2025")
  const [grades, setGrades] = useState<Grade[]>([])

  const updateGrade = (studentId: string, description: string) => {
    if (!selectedSubject || !selectedSemester) return

    setGrades((prev) => {
      const existingIndex = prev.findIndex(
        (g) => g.studentId === studentId && g.subject === selectedSubject && g.semester === selectedSemester,
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], description }
        return updated
      } else {
        return [
          ...prev,
          {
            studentId,
            subject: selectedSubject,
            semester: selectedSemester,
            description,
          },
        ]
      }
    })
  }

  const getGrade = (studentId: string) => {
    return (
      grades.find((g) => g.studentId === studentId && g.subject === selectedSubject && g.semester === selectedSemester)
        ?.description || ""
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Edit Penilaian Siswa PAUD
        </CardTitle>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Aspek Penilaian:</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih aspek penilaian" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">Semester:</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedSubject || !selectedSemester ? (
          <div className="text-center py-8 text-muted-foreground">
            Pilih aspek penilaian dan semester untuk mulai mengedit penilaian
          </div>
        ) : (
          <div className="space-y-6">
            {mockStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={student.photo || "/placeholder.svg"}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-lg">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">Kelas {student.class}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deskripsi Penilaian:</label>
                  <Textarea
                    value={getGrade(student.id)}
                    onChange={(e) => updateGrade(student.id, e.target.value)}
                    placeholder="Tuliskan deskripsi perkembangan dan capaian siswa untuk aspek ini..."
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tuliskan penilaian deskriptif yang menggambarkan perkembangan dan capaian siswa
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Simpan Penilaian
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
