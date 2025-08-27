"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, X, Clock, Heart } from "lucide-react"
import { mockStudents } from "@/lib/mock-data"

type AttendanceStatus = "hadir" | "tidak-hadir" | "izin" | "sakit"

interface AttendanceRecord {
  studentId: string
  status: AttendanceStatus
  date: string
  note?: string
}

export function AttendanceEditor() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(
    mockStudents.map((student) => ({
      studentId: student.id,
      status: "hadir" as AttendanceStatus,
      date: selectedDate,
    })),
  )

  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((record) => (record.studentId === studentId ? { ...record, status } : record)))
  }

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "hadir":
        return "bg-green-100 text-green-800 border-green-200"
      case "tidak-hadir":
        return "bg-red-100 text-red-800 border-red-200"
      case "izin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "sakit":
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "hadir":
        return <Check className="w-4 h-4" />
      case "tidak-hadir":
        return <X className="w-4 h-4" />
      case "izin":
        return <Clock className="w-4 h-4" />
      case "sakit":
        return <Heart className="w-4 h-4" />
    }
  }

  const getStatusText = (status: AttendanceStatus) => {
    switch (status) {
      case "hadir":
        return "Hadir"
      case "tidak-hadir":
        return "Tidak Hadir"
      case "izin":
        return "Izin"
      case "sakit":
        return "Sakit"
    }
  }

  const attendanceStats = attendance.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
      return acc
    },
    {} as Record<AttendanceStatus, number>,
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceStats.hadir || 0}</div>
            <div className="text-sm text-muted-foreground">Hadir</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{attendanceStats["tidak-hadir"] || 0}</div>
            <div className="text-sm text-muted-foreground">Tidak Hadir</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{attendanceStats.izin || 0}</div>
            <div className="text-sm text-muted-foreground">Izin</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{attendanceStats.sakit || 0}</div>
            <div className="text-sm text-muted-foreground">Sakit</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Presensi Siswa
          </CardTitle>
          <div className="flex items-center gap-4">
            <label htmlFor="date" className="text-sm font-medium">
              Tanggal:
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.map((student) => {
              const studentAttendance = attendance.find((a) => a.studentId === student.id)
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.photo || "/placeholder.svg"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="font-medium text-lg">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Kelas {student.class}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(studentAttendance?.status || "hadir")} px-3 py-1`}>
                      {getStatusIcon(studentAttendance?.status || "hadir")}
                      <span className="ml-1">{getStatusText(studentAttendance?.status || "hadir")}</span>
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={studentAttendance?.status === "hadir" ? "default" : "outline"}
                        onClick={() => updateAttendance(student.id, "hadir")}
                        className="text-xs"
                      >
                        Hadir
                      </Button>
                      <Button
                        size="sm"
                        variant={studentAttendance?.status === "tidak-hadir" ? "destructive" : "outline"}
                        onClick={() => updateAttendance(student.id, "tidak-hadir")}
                        className="text-xs"
                      >
                        Tidak Hadir
                      </Button>
                      <Button
                        size="sm"
                        variant={studentAttendance?.status === "izin" ? "secondary" : "outline"}
                        onClick={() => updateAttendance(student.id, "izin")}
                        className="text-xs"
                      >
                        Izin
                      </Button>
                      <Button
                        size="sm"
                        variant={studentAttendance?.status === "sakit" ? "secondary" : "outline"}
                        onClick={() => updateAttendance(student.id, "sakit")}
                        className="text-xs"
                      >
                        Sakit
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <Button size="lg" className="px-8">
              Simpan Presensi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
