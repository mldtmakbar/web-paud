import jsPDF from "jspdf"
import type { Student, Payment, AttendanceRecord, Grade } from "./mock-data"

interface ExportData {
  student: Student
  payments: Payment[]
  attendance: AttendanceRecord[]
  grades: Grade[]
}

export function exportStudentReportToPDF(data: ExportData) {
  const { student, payments, attendance, grades } = data
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("TK CERIA", 20, 20)
  doc.setFontSize(16)
  doc.text("Laporan Siswa", 20, 30)

  // Student Info
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("PROFIL SISWA", 20, 50)
  doc.setFontSize(12)
  doc.text(`Nama: ${student.name}`, 20, 65)
  doc.text(`Kelas: ${student.class}`, 20, 75)
  doc.text(`Tanggal Lahir: ${new Date(student.dateOfBirth).toLocaleDateString("id-ID")}`, 20, 85)
  doc.text(`Orang Tua: ${student.parentName}`, 20, 95)
  doc.text(`Kontak: ${student.parentPhone}`, 20, 105)

  // Payment Status
  let yPos = 125
  doc.setFontSize(14)
  doc.text("STATUS PEMBAYARAN", 20, yPos)
  yPos += 15

  doc.setFontSize(10)
  payments.forEach((payment) => {
    const status = payment.status === "paid" ? "LUNAS" : payment.status === "pending" ? "PENDING" : "BELUM BAYAR"
    const statusColor =
      payment.status === "paid" ? [0, 128, 0] : payment.status === "pending" ? [255, 165, 0] : [255, 0, 0]

    doc.setTextColor(0, 0, 0)
    doc.text(`${payment.description}`, 20, yPos)
    doc.text(`Rp ${payment.amount.toLocaleString("id-ID")}`, 100, yPos)
    doc.text(`${new Date(payment.dueDate).toLocaleDateString("id-ID")}`, 140, yPos)

    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
    doc.text(status, 170, yPos)

    yPos += 10
  })

  // Attendance Summary
  yPos += 10
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("RINGKASAN KEHADIRAN", 20, yPos)
  yPos += 15

  const totalDays = attendance.length
  const presentDays = attendance.filter((a) => a.status === "hadir").length
  const absentDays = attendance.filter((a) => a.status === "tidak-hadir").length
  const excusedDays = attendance.filter((a) => a.status === "izin").length
  const sickDays = attendance.filter((a) => a.status === "sakit").length

  doc.setFontSize(10)
  doc.text(`Total Hari: ${totalDays}`, 20, yPos)
  doc.text(`Hadir: ${presentDays}`, 20, yPos + 10)
  doc.text(`Tidak Hadir: ${absentDays}`, 20, yPos + 20)
  doc.text(`Izin: ${excusedDays}`, 20, yPos + 30)
  doc.text(`Sakit: ${sickDays}`, 20, yPos + 40)

  const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "0"
  doc.text(`Persentase Kehadiran: ${attendanceRate}%`, 20, yPos + 50)

  // Grades
  yPos += 70
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(14)
  doc.text("NILAI SISWA", 20, yPos)
  yPos += 15

  doc.setFontSize(10)
  const subjects = [...new Set(grades.map((g) => g.subject))]

  subjects.forEach((subject) => {
    const subjectGrades = grades.filter((g) => g.subject === subject)
    const avgScore =
      subjectGrades.length > 0
        ? (subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length).toFixed(1)
        : "0"

    doc.text(`${subject}: ${avgScore}`, 20, yPos)
    yPos += 10
  })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}`, 20, 280)
  doc.text("TK Ceria - Sistem Manajemen Sekolah", 20, 290)

  // Save the PDF
  doc.save(`Laporan_${student.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)
}
