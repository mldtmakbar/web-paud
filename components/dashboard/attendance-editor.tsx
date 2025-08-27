"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  getAttendance,
  getClasses,
  getStudents,
  addAttendance,
  updateAttendance
} from '@/lib/database'
import type { Attendance, Class, Student } from '@/lib/types'

export function AttendanceEditor() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadStudents(selectedClass)
      loadAttendance(selectedClass, selectedDate)
    }
  }, [selectedClass, selectedDate])

  async function loadClasses() {
    setIsLoading(true)
    try {
      const data = await getClasses()
      setClasses(data)
    } catch (error) {
      console.error('Error loading classes:', error)
    }
    setIsLoading(false)
  }

  async function loadStudents(classId: string) {
    try {
      const data = await getStudents(classId)
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  async function loadAttendance(classId: string, date: Date) {
    try {
      const data = await getAttendance(classId, date)
      setAttendance(data)
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
  }

  async function handleAttendanceChange(studentId: string, status: string) {
    try {
      const existingAttendance = attendance.find(a => 
        a.student_id === studentId && 
        new Date(a.date).toDateString() === selectedDate.toDateString()
      )

      if (existingAttendance) {
        await updateAttendance(existingAttendance.id, {
          ...existingAttendance,
          status
        })
      } else {
        await addAttendance({
          class_id: selectedClass,
          student_id: studentId,
          date: selectedDate.toISOString().split('T')[0],
          status
        })
      }

      await loadAttendance(selectedClass, selectedDate)
    } catch (error) {
      console.error('Error updating attendance:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Presensi Siswa</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Pilih Kelas</Label>
            <Select
              value={selectedClass}
              onValueChange={setSelectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classData) => (
                  <SelectItem key={classData.id} value={classData.id}>
                    {classData.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pilih Tanggal</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
        </div>

        {selectedClass && (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left">Nama Siswa</th>
                  <th className="py-2 px-4 text-left">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const studentAttendance = attendance.find(a => 
                    a.student_id === student.id && 
                    new Date(a.date).toDateString() === selectedDate.toDateString()
                  )

                  return (
                    <tr key={student.id} className="border-t">
                      <td className="py-2 px-4">{student.name}</td>
                      <td className="py-2 px-4">
                        <Select
                          value={studentAttendance?.status || 'hadir'}
                          onValueChange={(value) => handleAttendanceChange(student.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hadir">Hadir</SelectItem>
                            <SelectItem value="sakit">Sakit</SelectItem>
                            <SelectItem value="izin">Izin</SelectItem>
                            <SelectItem value="alpha">Alpha</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
