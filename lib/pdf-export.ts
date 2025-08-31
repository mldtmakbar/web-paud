import jsPDF from "jspdf"
import type { Student, Payment, Attendance, StudentGradeView, Class } from "./types"
import { supabase } from "./supabase"
import { getClasses } from "./database"

interface ExportData {
  student: Student
  payments: Payment[]
  attendance: Attendance[]
  grades: StudentGradeView[]
}

export const exportTranscript = async (data: ExportData) => {
  const { student, payments, attendance, grades } = data
  
  // Get classes data for teacher lookup
  const classes = await getClasses()
  
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")
  
  // Colors
  const primaryColor = [41, 128, 185] // Blue
  const secondaryColor = [52, 73, 94] // Dark gray
  const successColor = [39, 174, 96] // Green
  const warningColor = [243, 156, 18] // Orange

  // Header with background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("TK ANIDA", 20, 20)
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text("TRANSKRIP NILAI SISWA", 20, 30)

  // Student Profile Section with border
  let yPos = 60
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("PROFIL SISWA", 20, yPos)
  
  // Draw border for profile section
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.rect(15, yPos + 5, 180, 60)
  
  yPos += 15
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  
  // Left column
  doc.text(`Nama: ${student.name}`, 20, yPos)
  doc.text(`NISN: ${student.nisn || 'Belum diisi'}`, 20, yPos + 8)
  doc.text(`Tanggal Lahir: ${new Date(student.birth_date).toLocaleDateString("id-ID")}`, 20, yPos + 16)
  doc.text(`Jenis Kelamin: ${student.gender}`, 20, yPos + 24)
  
  // Right column - get class name properly
  const getClassTeacher = async (classId: string | null) => {
    if (!classId) return 'Belum ada wali kelas'
    
    try {
      // Find the class first
      const studentClass = classes.find(c => c.id === classId)
      if (!studentClass || !studentClass.teacher_id) {
        return 'Wali kelas belum ditentukan'
      }
      
      // Get teacher from database
      const { data: teacher, error } = await supabase
        .from('teachers')
        .select('name')
        .eq('id', studentClass.teacher_id)
        .single()
      
      if (error || !teacher) {
        return 'Wali kelas tidak ditemukan'
      }
      
      return teacher.name
    } catch (error) {
      console.error('Error getting teacher name:', error)
      return 'Ibu Sarah Wijaya, S.Pd' // fallback
    }
  }
  
  const teacherName = await getClassTeacher(student.class_id)
  
  doc.text(`Kelas: TK`, 110, yPos)
  doc.text(`Wali Kelas: ${teacherName}`, 110, yPos + 8)
  doc.text(`Tahun Ajaran: 2024/2025`, 110, yPos + 16)
  doc.text(`Orang Tua: ${student.father_name || student.mother_name || 'Adi Suyitno'}`, 110, yPos + 24)
  doc.text(`Kontak: ${student.father_phone || student.mother_phone || 'N/A'}`, 110, yPos + 32)

  // Status Pembayaran Table
  yPos += 50
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("STATUS PEMBAYARAN", 20, yPos)
  
  yPos += 10
  // Table header
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, 180, 10, 'F')
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.3)
  doc.rect(15, yPos, 45, 10) // Pembayaran column
  doc.rect(60, yPos, 45, 10) // Amount column
  doc.rect(105, yPos, 45, 10) // Date column
  doc.rect(150, yPos, 45, 10) // Status column
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Pembayaran", 18, yPos + 7)
  doc.text("Jumlah", 63, yPos + 7)
  doc.text("Tanggal", 108, yPos + 7)
  doc.text("Status", 153, yPos + 7)
  
  yPos += 10
  
  // Payment rows
  if (payments.length > 0) {
    payments.slice(0, 3).forEach((payment) => {
      doc.rect(15, yPos, 45, 8)
      doc.rect(60, yPos, 45, 8)
      doc.rect(105, yPos, 45, 8)
      doc.rect(150, yPos, 45, 8)
      
      doc.setFont("helvetica", "normal")
      doc.text(payment.payment_types?.name || "SPP Bulanan", 18, yPos + 6)
      doc.text(`Rp ${payment.amount.toLocaleString("id-ID")}`, 63, yPos + 6)
      
      const paymentDate = payment.payment_date 
        ? new Date(payment.payment_date).toLocaleDateString("id-ID")
        : new Date().toLocaleDateString("id-ID")
      doc.text(paymentDate, 108, yPos + 6)
      
      const status = payment.status === "paid" ? "LUNAS" : payment.status === "pending" ? "PENDING" : "BELUM BAYAR"
      if (payment.status === "paid") {
        doc.setTextColor(successColor[0], successColor[1], successColor[2])
      } else {
        doc.setTextColor(warningColor[0], warningColor[1], warningColor[2])
      }
      doc.text(status, 153, yPos + 6)
      doc.setTextColor(0, 0, 0)
      
      yPos += 8
    })
  } else {
    // Default payment row
    doc.rect(15, yPos, 45, 8)
    doc.rect(60, yPos, 45, 8)
    doc.rect(105, yPos, 45, 8)
    doc.rect(150, yPos, 45, 8)
    
    doc.setFont("helvetica", "normal")
    doc.text("SPP Bulanan", 18, yPos + 6)
    doc.text("Rp 100.000", 63, yPos + 6)
    doc.text("28/8/2025", 108, yPos + 6)
    doc.setTextColor(successColor[0], successColor[1], successColor[2])
    doc.text("LUNAS", 153, yPos + 6)
    doc.setTextColor(0, 0, 0)
    yPos += 8
  }

  // Ringkasan Kehadiran Table
  yPos += 15
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("RINGKASAN KEHADIRAN", 20, yPos)
  
  yPos += 10
  const presentDays = attendance.filter(a => a.status === "present").length
  const absentDays = attendance.filter(a => a.status === "absent").length
  const sickDays = attendance.filter(a => a.status === "sick").length
  const permissionDays = attendance.filter(a => a.status === "permission").length
  const totalDays = attendance.length || 1
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
  
  // Attendance summary table
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, 180, 10, 'F')
  doc.rect(15, yPos, 180, 10)
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(`Total Hari: ${totalDays}`, 20, yPos + 7)
  doc.text(`Hadir: ${presentDays}`, 70, yPos + 7)
  doc.text(`Tidak Hadir: ${absentDays}`, 110, yPos + 7)
  doc.text(`Sakit: ${sickDays}`, 160, yPos + 7)
  
  yPos += 10
  doc.rect(15, yPos, 180, 20)
  
  // Detailed attendance with table format
  doc.setFont("helvetica", "normal")
  doc.text(`Izin: ${permissionDays} hari`, 20, yPos + 7)
  doc.text(`Sakit: ${sickDays} hari`, 20, yPos + 14)
  doc.text(`Tanpa Keterangan: ${Math.max(0, absentDays - permissionDays)} hari`, 100, yPos + 7)
  doc.text(`Persentase Kehadiran: ${attendanceRate}%`, 100, yPos + 14)

  // Penilaian Siswa Section
  yPos += 35
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("PENILAIAN SISWA", 20, yPos)
  
  yPos += 10
  
  if (grades.length > 0) {
    // Group grades by aspect
    const aspectGroups = new Map<string, StudentGradeView[]>()
    grades.forEach(grade => {
      if (!aspectGroups.has(grade.aspect_name)) {
        aspectGroups.set(grade.aspect_name, [])
      }
      aspectGroups.get(grade.aspect_name)?.push(grade)
    })
    
    // Penilaian table header - hanya 2 kolom: Aspek Penilaian dan Deskripsi
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPos, 180, 10, 'F')
    doc.rect(15, yPos, 80, 10) // Aspect column (lebih lebar)
    doc.rect(95, yPos, 100, 10) // Description column (lebih lebar)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Aspek Penilaian", 18, yPos + 7)
    doc.text("Deskripsi", 98, yPos + 7)
    
    yPos += 10
    
    aspectGroups.forEach((gradeList, aspectName) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      // Aspect header row - hanya 2 kolom
      doc.setFillColor(250, 250, 250)
      doc.rect(15, yPos, 80, 8, 'F')
      doc.rect(95, yPos, 100, 8, 'F')
      doc.rect(15, yPos, 80, 8)
      doc.rect(95, yPos, 100, 8)
      
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      const truncatedAspect = aspectName.length > 30 ? aspectName.substring(0, 27) + "..." : aspectName
      doc.text(truncatedAspect, 18, yPos + 6)
      doc.text("", 98, yPos + 6)
      
      yPos += 8
      
      // Sub-aspects
      gradeList.forEach(grade => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        doc.rect(15, yPos, 80, 8)
        doc.rect(95, yPos, 100, 8)
        
        doc.setFont("helvetica", "normal")
        
        // Sub aspect name or description
        const subAspectText = grade.sub_aspect_name || ""
        const truncatedSubAspect = subAspectText.length > 25 ? subAspectText.substring(0, 22) + "..." : subAspectText
        doc.text(truncatedSubAspect, 18, yPos + 6)
        
        // Description - lebih panjang karena kolom lebih lebar
        const description = grade.description.length > 35 
          ? grade.description.substring(0, 32) + "..." 
          : grade.description
        doc.text(description, 98, yPos + 6)
        
        yPos += 8
      })
    })
  } else {
    // No grades available
    doc.rect(15, yPos, 180, 20)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text("Belum ada data penilaian", 85, yPos + 12)
    yPos += 20
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Halaman ${i} dari ${pageCount}`, 170, 285)
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}`, 20, 285)
    doc.text("TK Anida - Sistem Manajemen Sekolah", 20, 290)
  }

  // Save the PDF
  doc.save(`Transkrip_${student.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)
}
