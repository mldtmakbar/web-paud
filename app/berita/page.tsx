import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"

export default function BeritaPage() {
  const news = [
    {
      id: 1,
      title: "Penerimaan Siswa Baru Tahun Ajaran 2024/2025",
      excerpt:
        "TK Ceria membuka pendaftaran siswa baru untuk tahun ajaran 2024/2025. Dapatkan early bird discount untuk pendaftar awal.",
      date: "15 Januari 2024",
      author: "Admin TK Ceria",
      category: "Pendaftaran",
      image: "/kindergarten-registration-announcement-colorful.png",
    },
    {
      id: 2,
      title: "Kegiatan Field Trip ke Kebun Binatang",
      excerpt:
        "Siswa-siswi TK Ceria mengunjungi kebun binatang sebagai bagian dari pembelajaran tentang hewan dan alam.",
      date: "10 Januari 2024",
      author: "Bu Sarah",
      category: "Kegiatan",
      image: "/children-field-trip-to-zoo-educational-activity.png",
    },
    {
      id: 3,
      title: "Workshop Parenting: Mendidik Anak di Era Digital",
      excerpt: "TK Ceria mengadakan workshop parenting untuk membantu orang tua dalam mendidik anak di era digital.",
      date: "5 Januari 2024",
      author: "Dr. Maya Sari",
      category: "Workshop",
      image: "/parenting-workshop-digital-era-presentation.png",
    },
    {
      id: 4,
      title: "Prestasi Siswa dalam Lomba Mewarnai Tingkat Kota",
      excerpt:
        "Selamat kepada siswa-siswi TK Ceria yang meraih juara dalam lomba mewarnai tingkat kota Jakarta Selatan.",
      date: "28 Desember 2023",
      author: "Bu Rina",
      category: "Prestasi",
      image: "/children-coloring-competition-winners-kindergarten.png",
    },
    {
      id: 5,
      title: "Perayaan Hari Kartini di TK Ceria",
      excerpt:
        "Siswa-siswi TK Ceria merayakan Hari Kartini dengan mengenakan pakaian adat dan belajar tentang kebudayaan Indonesia.",
      date: "21 April 2023",
      author: "Bu Dewi",
      category: "Perayaan",
      image: "/kartini-day-celebration-kindergarten-traditional-c.png",
    },
    {
      id: 6,
      title: "Program Baca Tulis Hitung untuk Persiapan SD",
      excerpt:
        "TK Ceria meluncurkan program khusus baca tulis hitung untuk mempersiapkan siswa memasuki jenjang sekolah dasar.",
      date: "15 Maret 2023",
      author: "Bu Ani",
      category: "Program",
      image: "/kindergarten-reading-writing-counting-program-prep.png",
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Pendaftaran: "bg-primary text-primary-foreground",
      Kegiatan: "bg-secondary text-secondary-foreground",
      Workshop: "bg-accent text-accent-foreground",
      Prestasi: "bg-green-500 text-white",
      Perayaan: "bg-purple-500 text-white",
      Program: "bg-blue-500 text-white",
    }
    return colors[category] || "bg-gray-500 text-white"
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 to-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6 font-serif">Berita & Kegiatan</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ikuti perkembangan terbaru dan berbagai kegiatan menarik di TK Ceria. Tetap terhubung dengan komunitas
            sekolah kami.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
