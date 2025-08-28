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
import { Save, CheckCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  getAttendanceByClass,
  getClasses,
  getStudentsByClass,
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
  const [isSaving, setIsSaving] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<{ [studentId: string]: string }>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadStudents(selectedClass)
      loadAttendance(selectedClass, selectedDate)
      // Reset pending changes when class or date changes
      setPendingChanges({})
      setHasChanges(false)
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
      const data = await getStudentsByClass(classId)
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  async function loadAttendance(classId: string, date: Date) {
    try {
      const dateString = date.toISOString().split('T')[0]
      const data = await getAttendanceByClass(classId, dateString)
      setAttendance(data)
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
  }

  async function handleAttendanceChange(studentId: string, status: string) {
    setPendingChanges(prev => ({
      ...prev,
      [studentId]: status
    }))
    setHasChanges(true)
  }

  async function saveAllAttendance() {
    if (!hasChanges) return

    setIsSaving(true)
    try {
      const promises = Object.entries(pendingChanges).map(async ([studentId, status]) => {
        // Map UI status to database status
        const statusMap: { [key: string]: 'present' | 'absent' | 'sick' | 'permission' } = {
          'hadir': 'present',
          'sakit': 'sick',
          'izin': 'permission',
          'alpha': 'absent'
        }
        
        const dbStatus = statusMap[status] || 'present'
        
        const existingAttendance = attendance.find(a => 
          a.student_id === studentId && 
          new Date(a.date).toDateString() === selectedDate.toDateString()
        )

        if (existingAttendance) {
          return updateAttendance(existingAttendance.id, {
            status: dbStatus
          })
        } else {
          return addAttendance({
            student_id: studentId,
            date: selectedDate.toISOString().split('T')[0],
            status: dbStatus
          })
        }
      })

      await Promise.all(promises)
      await loadAttendance(selectedClass, selectedDate)
      
      setPendingChanges({})
      setHasChanges(false)
      
      toast({
        title: "Berhasil",
        description: "Data kehadiran berhasil disimpan!",
        variant: "default",
      })
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data kehadiran. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Presensi Siswa</h2>
        {hasChanges && (
          <Button 
            onClick={saveAllAttendance} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Semua
              </>
            )}
          </Button>
        )}
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

                  // Map database status to UI status
                  const getUIStatus = (dbStatus?: string) => {
                    const statusMap: { [key: string]: string } = {
                      'present': 'hadir',
                      'sick': 'sakit',
                      'permission': 'izin',
                      'absent': 'alpha'
                    }
                    return statusMap[dbStatus || 'present'] || 'hadir'
                  }

                  // Get current value (pending change or existing attendance)
                  const currentValue = pendingChanges[student.id] || getUIStatus(studentAttendance?.status)

                  return (
                    <tr key={student.id} className="border-t">
                      <td className="py-2 px-4">{student.name}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <Select
                            value={currentValue}
                            onValueChange={(value) => handleAttendanceChange(student.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hadir">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Hadir
                                </div>
                              </SelectItem>
                              <SelectItem value="sakit">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  Sakit
                                </div>
                              </SelectItem>
                              <SelectItem value="izin">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  Izin
                                </div>
                              </SelectItem>
                              <SelectItem value="alpha">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  Alpha
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {pendingChanges[student.id] && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full" title="Belum tersimpan"></div>
                          )}
                        </div>
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
