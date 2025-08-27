// Mock data for demonstration - replace with real API calls later
export interface Student {
  id: string
  name: string
  class: string
  dateOfBirth: string
  parentId: string
  photo: string
  nisn?: string
  gender: "L" | "P"
  address: string
  bloodType?: string
  allergies?: string
  emergencyContact: string
  emergencyPhone: string
}

export interface Payment {
  id: string
  studentId: string
  tahun_ajaran: string
  semester: number
  up3: number
  sdp2: number
  bpp_paket: number
  bpp_non_paket: number
  sks: number
  perpustakaan: number
  mangkir: number
  uang_status: number
  biaya_kesehatan: number
  asrama: number
  total: number
  potongan: number
  beasiswa: number
  total_tagihan: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  paidDate?: string
}

export interface Attendance {
  id: string
  studentId: string
  date: string
  status: "present" | "absent" | "sick" | "permission"
  note?: string
}

export interface Grade {
  id: string
  studentId: string
  subject: string
  category: string
  description: string // Descriptive assessment instead of numerical score
  semester: string
  date: string
  teacherName: string
  note?: string
}

export interface Class {
  id: string
  name: string
  level: "TK A" | "TK B" | "Kelompok Bermain"
  teacherId: string
  teacherName: string
  capacity: number
  currentStudents: number
  ageRange: string
  schedule: string
  room: string
  status: "active" | "inactive"
  description?: string
}

// Comprehensive parent information interface based on provided schema
export interface Parent {
  id_orangtua: string
  id_siswa: string
  id_user: string
  nama_ayah: string
  pekerjaan_ayah: string
  alamat_pekerjaan_ayah: string
  nomor_telepon_ayah: string
  email_ayah: string
  nama_ibu: string
  pekerjaan_ibu: string
  alamat_pekerjaan_ibu: string
  nomor_telepon_ibu: string
  email_ibu: string
  alamat_rumah: string
}

// Adding PaymentType interface
export interface PaymentType {
  id: string
  name: string
  code: string
  description?: string
  defaultAmount: number
  isActive: boolean
  category: "mandatory" | "optional" | "discount"
  order: number
}

export interface News {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishDate: string
  status: "published" | "draft" | "archived"
  category: string
  image?: string
  tags: string[]
  views: number
  featured: boolean
}

// Mock students data
export const mockStudents: Student[] = [
  {
    id: "student1",
    name: "Andi Santoso",
    class: "TK A",
    dateOfBirth: "2019-05-15",
    parentId: "1",
    photo: "/student-profile-photo-kindergarten-boy.png",
    nisn: "1234567890",
    gender: "L",
    address: "Jl. Merdeka No. 123, Jakarta Selatan",
    bloodType: "O",
    allergies: "Tidak ada",
    emergencyContact: "Ibu Sari Santoso",
    emergencyPhone: "081234567890",
  },
]

// Mock payments data
export const mockPayments: Payment[] = [
  {
    id: "pay1",
    studentId: "student1",
    tahun_ajaran: "2024/2025",
    semester: 1,
    up3: 9000000,
    sdp2: 11000000,
    bpp_paket: 9000000,
    bpp_non_paket: 0,
    sks: 0,
    perpustakaan: 0,
    mangkir: 0,
    uang_status: 0,
    biaya_kesehatan: 150000,
    asrama: 0,
    total: 29150000,
    potongan: 0,
    beasiswa: 0,
    total_tagihan: 29150000,
    status: "paid",
    dueDate: "2024-08-10",
    paidDate: "2024-08-08",
  },
  {
    id: "pay2",
    studentId: "student1",
    tahun_ajaran: "2024/2025",
    semester: 2,
    up3: 0,
    sdp2: 0,
    bpp_paket: 9000000,
    bpp_non_paket: 0,
    sks: 0,
    perpustakaan: 0,
    mangkir: 0,
    uang_status: 0,
    biaya_kesehatan: 150000,
    asrama: 0,
    total: 9150000,
    potongan: 0,
    beasiswa: 0,
    total_tagihan: 9150000,
    status: "pending",
    dueDate: "2025-01-10",
  },
]

// Mock attendance data
export const mockAttendance: Attendance[] = [
  {
    id: "att1",
    studentId: "student1",
    date: "2024-01-15",
    status: "present",
  },
  {
    id: "att2",
    studentId: "student1",
    date: "2024-01-16",
    status: "present",
  },
  {
    id: "att3",
    studentId: "student1",
    date: "2024-01-17",
    status: "sick",
    note: "Demam",
  },
  {
    id: "att4",
    studentId: "student1",
    date: "2024-01-18",
    status: "present",
  },
  {
    id: "att5",
    studentId: "student1",
    date: "2024-01-19",
    status: "absent",
  },
]

export const mockGrades: Grade[] = [
  {
    id: "grade1",
    studentId: "student1",
    subject: "Nilai Agama dan Budi Pekerti",
    category: "Semester 1",
    description:
      "Pada semester 1 ini, Ananda dapat mempraktikkan ajaran agama islam dengan baik ditunjukkan ketika belajar wudlu, shalat dan berdo'a setiap harinya. Ananda dapat menunjukkan perilaku baik sesuai ajaran agama. Sebelum melakukan kegiatan berdo'a ananda dapat membuat kesepakatan peraturan saat berdo'a (mengangkat kedua tangan, tidak boleh ngobrol, tidak boleh lari-larian, duduk manis) serta dapat memahami aturan yang dibuatnya. Ananda dapat mengamalkan ajaran agama islam dengan baik, pada semester 1 ini ananda hafal surat Al-Fiil, shalawat nariyah, asmaul-husna serta kalimat toyyibah.",
    semester: "Semester 1 - 2024/2025",
    date: "2024-12-20",
    teacherName: "Bu Sarah Wijaya",
  },
  {
    id: "grade2",
    studentId: "student1",
    subject: "Jati Diri",
    category: "Semester 1",
    description:
      "Ananda menunjukkan keterlibatan aktif saat melakukan koordinasi motorik kasar, saat bermain dan menyirami tanaman saat melihat gurunya sedang menyirami tanaman serta dapat membedakan aktivitas yang kotor dan tidak kotor. Ananda menunjukkan sikap peduli kesehatan diri saat menyebutkan jenis makanan sehat dan yang tidak sehat untuk dirinya.",
    semester: "Semester 1 - 2024/2025",
    date: "2024-12-20",
    teacherName: "Bu Sarah Wijaya",
  },
  {
    id: "grade3",
    studentId: "student1",
    subject: "Literasi",
    category: "Semester 1",
    description:
      "Ananda dapat mengenal huruf vokal dan konsonan dengan baik. Ananda mampu membaca kata sederhana dan mulai belajar menulis huruf dengan bantuan garis bantu. Kemampuan menyimak cerita dan menjawab pertanyaan sederhana sudah berkembang dengan baik.",
    semester: "Semester 1 - 2024/2025",
    date: "2024-12-20",
    teacherName: "Bu Sarah Wijaya",
  },
  {
    id: "grade4",
    studentId: "student1",
    subject: "Numerasi",
    category: "Semester 1",
    description:
      "Ananda dapat mengenal angka 1-20 dengan baik dan mampu menghitung benda konkret. Kemampuan mengurutkan angka dan membandingkan jumlah benda sudah berkembang sesuai tahapan usianya. Ananda juga mulai mengenal konsep penjumlahan sederhana.",
    semester: "Semester 1 - 2024/2025",
    date: "2024-12-20",
    teacherName: "Bu Sarah Wijaya",
  },
]

export const mockClasses: Class[] = [
  {
    id: "class1",
    name: "TK A - Melati",
    level: "TK A",
    teacherId: "teacher1",
    teacherName: "Bu Sarah Wijaya",
    capacity: 20,
    currentStudents: 18,
    ageRange: "4-5 tahun",
    schedule: "Senin-Jumat, 08:00-11:00",
    room: "Ruang Melati",
    status: "active",
    description: "Kelas untuk anak usia 4-5 tahun dengan fokus pada pengembangan motorik dan kognitif dasar",
  },
  {
    id: "class2",
    name: "TK B - Mawar",
    level: "TK B",
    teacherId: "teacher2",
    teacherName: "Bu Rina Sari",
    capacity: 20,
    currentStudents: 19,
    ageRange: "5-6 tahun",
    schedule: "Senin-Jumat, 08:00-11:30",
    room: "Ruang Mawar",
    status: "active",
    description: "Kelas persiapan masuk SD dengan fokus pada kemampuan membaca, menulis, dan berhitung",
  },
  {
    id: "class3",
    name: "Kelompok Bermain - Anggrek",
    level: "Kelompok Bermain",
    teacherId: "teacher3",
    teacherName: "Bu Lisa Putri",
    capacity: 15,
    currentStudents: 12,
    ageRange: "3-4 tahun",
    schedule: "Senin, Rabu, Jumat, 09:00-11:00",
    room: "Ruang Anggrek",
    status: "active",
    description: "Kelompok bermain untuk anak usia 3-4 tahun dengan fokus pada sosialisasi dan bermain",
  },
]

// Mock parent data
export const mockParents: Parent[] = [
  {
    id_orangtua: "parent1",
    id_siswa: "student1",
    id_user: "1",
    nama_ayah: "Budi Santoso",
    pekerjaan_ayah: "Software Engineer",
    alamat_pekerjaan_ayah: "Jl. Sudirman No. 45, Jakarta Pusat",
    nomor_telepon_ayah: "081234567890",
    email_ayah: "budi.santoso@email.com",
    nama_ibu: "Sari Santoso",
    pekerjaan_ibu: "Guru",
    alamat_pekerjaan_ibu: "SDN 01 Jakarta Selatan",
    nomor_telepon_ibu: "081234567891",
    email_ibu: "sari.santoso@email.com",
    alamat_rumah: "Jl. Merdeka No. 123, Jakarta Selatan",
  },
]

// Mock payment types data
export const mockPaymentTypes: PaymentType[] = [
  {
    id: "pt1",
    name: "UP3",
    code: "up3",
    description: "Uang Pangkal Program Pendidikan",
    defaultAmount: 9000000,
    isActive: true,
    category: "mandatory",
    order: 1,
  },
  {
    id: "pt2",
    name: "SDP2",
    code: "sdp2",
    description: "Sumbangan Dana Pengembangan Pendidikan",
    defaultAmount: 11000000,
    isActive: true,
    category: "mandatory",
    order: 2,
  },
  {
    id: "pt3",
    name: "BPP Paket",
    code: "bpp_paket",
    description: "Biaya Penyelenggaraan Pendidikan Paket",
    defaultAmount: 9000000,
    isActive: true,
    category: "mandatory",
    order: 3,
  },
  {
    id: "pt4",
    name: "BPP Non Paket",
    code: "bpp_non_paket",
    description: "Biaya Penyelenggaraan Pendidikan Non Paket",
    defaultAmount: 0,
    isActive: true,
    category: "optional",
    order: 4,
  },
  {
    id: "pt5",
    name: "SKS",
    code: "sks",
    description: "Sistem Kredit Semester",
    defaultAmount: 0,
    isActive: true,
    category: "optional",
    order: 5,
  },
  {
    id: "pt6",
    name: "Perpustakaan",
    code: "perpustakaan",
    description: "Biaya Perpustakaan",
    defaultAmount: 0,
    isActive: true,
    category: "optional",
    order: 6,
  },
  {
    id: "pt7",
    name: "Biaya Kesehatan",
    code: "biaya_kesehatan",
    description: "Biaya Kesehatan dan Asuransi",
    defaultAmount: 150000,
    isActive: true,
    category: "mandatory",
    order: 7,
  },
  {
    id: "pt8",
    name: "Potongan",
    code: "potongan",
    description: "Potongan Harga",
    defaultAmount: 0,
    isActive: true,
    category: "discount",
    order: 8,
  },
  {
    id: "pt9",
    name: "Beasiswa",
    code: "beasiswa",
    description: "Beasiswa",
    defaultAmount: 0,
    isActive: true,
    category: "discount",
    order: 9,
  },
]

// Mock news data
export const mockNews: News[] = [
  {
    id: "news1",
    title: "Penerimaan Siswa Baru Tahun Ajaran 2025/2026",
    content:
      "TK Ceria membuka pendaftaran siswa baru untuk tahun ajaran 2025/2026. Pendaftaran dimulai dari tanggal 1 Februari 2025 hingga 31 Maret 2025. Kami menyediakan program TK A, TK B, dan Kelompok Bermain dengan fasilitas lengkap dan tenaga pengajar yang berpengalaman.",
    excerpt: "TK Ceria membuka pendaftaran siswa baru untuk tahun ajaran 2025/2026 mulai 1 Februari 2025.",
    author: "Admin TK Ceria",
    publishDate: "2025-01-15",
    status: "published",
    category: "Pengumuman",
    image: "/kindergarten-registration.png",
    tags: ["pendaftaran", "siswa baru", "2025"],
    views: 245,
    featured: true,
  },
  {
    id: "news2",
    title: "Kegiatan Outing Class ke Kebun Binatang",
    content:
      "Siswa-siswi TK Ceria mengadakan kegiatan outing class ke Kebun Binatang Ragunan pada hari Jumat, 10 Januari 2025. Kegiatan ini bertujuan untuk mengenalkan berbagai jenis hewan kepada anak-anak sambil belajar di luar kelas. Semua siswa sangat antusias dan senang mengikuti kegiatan ini.",
    excerpt: "Siswa TK Ceria mengadakan outing class ke Kebun Binatang Ragunan untuk belajar mengenal hewan.",
    author: "Bu Sarah Wijaya",
    publishDate: "2025-01-12",
    status: "published",
    category: "Kegiatan",
    image: "/children-zoo-field-trip.png",
    tags: ["outing class", "kebun binatang", "pembelajaran"],
    views: 189,
    featured: false,
  },
  {
    id: "news3",
    title: "Perayaan Hari Kartini di TK Ceria",
    content:
      "Dalam rangka memperingati Hari Kartini, TK Ceria mengadakan berbagai kegiatan menarik seperti fashion show kebaya anak, lomba mewarnai, dan bercerita tentang tokoh pahlawan wanita Indonesia. Kegiatan ini bertujuan untuk mengenalkan nilai-nilai kepahlawanan dan budaya Indonesia kepada anak-anak.",
    excerpt: "TK Ceria merayakan Hari Kartini dengan fashion show kebaya dan berbagai lomba menarik.",
    author: "Bu Rina Sari",
    publishDate: "2024-04-21",
    status: "published",
    category: "Perayaan",
    image: "/kartini-day-celebration-children.png",
    tags: ["hari kartini", "budaya", "perayaan"],
    views: 156,
    featured: false,
  },
]

// Helper functions
export function getStudentsByParentId(parentId: string): Student[] {
  return mockStudents.filter((student) => student.parentId === parentId)
}

export function getPaymentsByStudentId(studentId: string): Payment[] {
  return mockPayments.filter((payment) => payment.studentId === studentId)
}

export function getAttendanceByStudentId(studentId: string): Attendance[] {
  return mockAttendance.filter((attendance) => attendance.studentId === studentId)
}

export function getGradesByStudentId(studentId: string): Grade[] {
  return mockGrades.filter((grade) => grade.studentId === studentId)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString))
}

export function getClassById(classId: string): Class | undefined {
  return mockClasses.find((cls) => cls.id === classId)
}

export function getStudentsByClassId(classId: string): Student[] {
  const targetClass = getClassById(classId)
  if (!targetClass) return []
  return mockStudents.filter((student) => student.class === targetClass.name.split(" - ")[0])
}

// Helper function to get parent data
export function getParentByStudentId(studentId: string): Parent | undefined {
  return mockParents.find((parent) => parent.id_siswa === studentId)
}

// Helper function to get payment types
export function getActivePaymentTypes(): PaymentType[] {
  return mockPaymentTypes.filter((type) => type.isActive).sort((a, b) => a.order - b.order)
}

export function getPaymentTypeByCode(code: string): PaymentType | undefined {
  return mockPaymentTypes.find((type) => type.code === code)
}

// Helper functions for news
export function getNewsByCategory(category: string): News[] {
  return mockNews.filter((news) => news.category === category)
}

export function getFeaturedNews(): News[] {
  return mockNews.filter((news) => news.featured && news.status === "published")
}

export function getPublishedNews(): News[] {
  return mockNews
    .filter((news) => news.status === "published")
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
}
