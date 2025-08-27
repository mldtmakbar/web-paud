"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Student } from "@/lib/mock-data"
import { Calendar, GraduationCap } from "lucide-react"

interface StudentCardProps {
  student: Student
  isSelected?: boolean
  onClick?: () => void
}

export default function StudentCard({ student, isSelected, onClick }: StudentCardProps) {
  const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <img
              src={student.photo || "/placeholder.svg?height=64&width=64"}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{student.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <GraduationCap className="h-4 w-4" />
              <span>{student.class}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{age} tahun</span>
            </div>
          </div>
          <Badge variant="secondary">{student.class}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
