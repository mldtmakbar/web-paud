import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Grade, formatDate } from "@/lib/mock-data"
import { BookOpen, FileText, User } from "lucide-react"

interface StudentGradesProps {
  grades: Grade[]
}

export default function StudentGrades({ grades }: StudentGradesProps) {
  const currentSemester = grades.length > 0 ? grades[0].semester : "Semester 1 - 2024/2025"
  const subjectCount = new Set(grades.map((grade) => grade.subject)).size

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Periode Penilaian</p>
                <p className="text-lg font-bold text-primary">{currentSemester}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Aspek Penilaian</p>
                <p className="text-3xl font-bold text-primary">{subjectCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PAUD Report Card Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Laporan Capaian Pembelajaran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {grades
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((grade) => (
                <div key={grade.id} className="border rounded-lg overflow-hidden">
                  {/* Subject Header */}
                  <div className="bg-yellow-400 text-black p-4 text-center font-bold text-lg">{grade.subject}</div>

                  {/* Description Content */}
                  <div className="p-6 bg-white">
                    <div className="prose prose-sm max-w-none text-justify leading-relaxed">{grade.description}</div>

                    {/* Teacher and Date Info */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Guru: {grade.teacherName}</span>
                      </div>
                      <div>
                        <Badge variant="outline">{formatDate(grade.date)}</Badge>
                      </div>
                    </div>

                    {grade.note && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 italic">Catatan: {grade.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
