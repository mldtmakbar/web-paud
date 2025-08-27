import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Attendance } from "@/lib/mock-data"
import { Calendar, CheckCircle, X, Heart, Clock } from "lucide-react"

interface AttendanceStatusProps {
  attendance: Attendance[]
}

export default function AttendanceStatus({ attendance }: AttendanceStatusProps) {
  const getStatusIcon = (status: Attendance["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "absent":
        return <X className="h-4 w-4 text-red-500" />
      case "sick":
        return <Heart className="h-4 w-4 text-orange-500" />
      case "permission":
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: Attendance["status"]) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500 text-white">Hadir</Badge>
      case "absent":
        return <Badge className="bg-red-500 text-white">Tidak Hadir</Badge>
      case "sick":
        return <Badge className="bg-orange-500 text-white">Sakit</Badge>
      case "permission":
        return <Badge className="bg-blue-500 text-white">Izin</Badge>
    }
  }

  const getStatusText = (status: Attendance["status"]) => {
    switch (status) {
      case "present":
        return "Hadir"
      case "absent":
        return "Alfa"
      case "sick":
        return "Sakit"
      case "permission":
        return "Izin"
    }
  }

  const totalPresent = attendance.filter((a) => a.status === "present").length
  const totalAbsent = attendance.filter((a) => a.status === "absent").length
  const totalSick = attendance.filter((a) => a.status === "sick").length
  const totalPermission = attendance.filter((a) => a.status === "permission").length
  const attendanceRate = attendance.length > 0 ? Math.round((totalPresent / attendance.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tingkat Kehadiran</p>
                <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Hadir</p>
                  <p className="text-lg font-bold text-green-500">{totalPresent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Tidak Hadir</p>
                  <p className="text-lg font-bold text-red-500">{totalAbsent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Sakit</p>
                  <p className="text-lg font-bold text-orange-500">{totalSick}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="font-semibold">Jumlah Kehadiran</TableHead>
                  <TableHead className="font-semibold">Jumlah Pertemuan</TableHead>
                  <TableHead className="font-semibold">Persentase Pertemuan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{totalPresent}</TableCell>
                  <TableCell>{attendance.length}</TableCell>
                  <TableCell className="font-semibold text-primary">{attendanceRate}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Presensi Kehadiran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-600 hover:bg-blue-600">
                  <TableHead className="text-white font-semibold">No</TableHead>
                  <TableHead className="text-white font-semibold">Tanggal</TableHead>
                  <TableHead className="text-white font-semibold">Hari</TableHead>
                  <TableHead className="text-white font-semibold">Kode Dosen</TableHead>
                  <TableHead className="text-white font-semibold">Dimulai</TableHead>
                  <TableHead className="text-white font-semibold">Selesai</TableHead>
                  <TableHead className="text-white font-semibold">RFID</TableHead>
                  <TableHead className="text-white font-semibold">Tipe Perkuliahan</TableHead>
                  <TableHead className="text-white font-semibold">Kehadiran</TableHead>
                  <TableHead className="text-white font-semibold">Isi Perkuliahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record, index) => {
                    const date = new Date(record.date)
                    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
                    const monthNames = [
                      "JAN",
                      "FEB",
                      "MAR",
                      "APR",
                      "MEI",
                      "JUN",
                      "JUL",
                      "AGS",
                      "SEP",
                      "OKT",
                      "NOV",
                      "DES",
                    ]

                    return (
                      <TableRow
                        key={record.id}
                        className={
                          record.status === "present"
                            ? "bg-white"
                            : record.status === "absent"
                              ? "bg-red-50"
                              : "bg-yellow-50"
                        }
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {date.getDate()}-{monthNames[date.getMonth()]}-{date.getFullYear().toString().slice(-2)}
                          </div>
                        </TableCell>
                        <TableCell>{dayNames[date.getDay()]}</TableCell>
                        <TableCell>TK001</TableCell>
                        <TableCell>08:00</TableCell>
                        <TableCell>11:00</TableCell>
                        <TableCell>KULIAH</TableCell>
                        <TableCell>
                          <span
                            className={
                              record.status === "present"
                                ? "text-green-600"
                                : record.status === "absent"
                                  ? "text-red-600"
                                  : "text-orange-600"
                            }
                          >
                            {getStatusText(record.status)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusText(record.status)}</TableCell>
                        <TableCell>
                          {record.note && <span className="text-sm text-muted-foreground">{record.note}</span>}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          {attendance.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Tidak ada data kehadiran</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
