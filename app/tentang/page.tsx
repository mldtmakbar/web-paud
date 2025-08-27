import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Users, BookOpen } from "lucide-react"

export default function TentangPage() {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Misi Kami",
      description: "Memberikan pendidikan berkualitas yang mengembangkan potensi akademik, sosial, dan emosional anak",
    },
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: "Visi Kami",
      description: "Menjadi taman kanak-kanak terdepan yang mencetak generasi cerdas, kreatif, dan berkarakter",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Tim Profesional",
      description: "Didukung oleh tenaga pengajar berpengalaman dan bersertifikat dalam pendidikan anak usia dini",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Metode Pembelajaran",
      description: "Menggunakan pendekatan bermain sambil belajar yang menyenangkan dan efektif",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6 font-serif">Tentang TK Ceria</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sejak didirikan, TK Ceria telah berkomitmen untuk memberikan pendidikan terbaik bagi anak-anak Indonesia
            dengan pendekatan yang holistik dan menyenangkan.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6 font-serif">Cerita Kami</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  TK Ceria didirikan dengan visi untuk menciptakan lingkungan belajar yang menyenangkan dan mendukung
                  perkembangan optimal setiap anak. Kami percaya bahwa setiap anak memiliki potensi unik yang perlu
                  dikembangkan dengan pendekatan yang tepat.
                </p>
                <p>
                  Dengan pengalaman lebih dari 10 tahun dalam bidang pendidikan anak usia dini, kami telah membantu
                  ratusan anak mengembangkan kemampuan akademik, sosial, dan emosional mereka melalui program
                  pembelajaran yang inovatif.
                </p>
                <p>
                  Tim pengajar kami terdiri dari profesional berpengalaman yang memahami kebutuhan dan karakteristik
                  anak usia dini, serta berkomitmen untuk memberikan pelayanan terbaik bagi setiap keluarga.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/kindergarten-teachers-with-children-in-classroom-l.png"
                alt="Guru dan murid TK Ceria"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Komitmen kami dalam memberikan pendidikan terbaik didasari oleh nilai-nilai yang kuat dan konsisten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{value.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Fasilitas Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fasilitas lengkap dan modern untuk mendukung proses pembelajaran yang optimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img src="/modern-kindergarten-classroom-with-colorful-furnit.png" alt="Ruang Kelas" className="rounded-lg shadow-md w-full mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Ruang Kelas Modern</h3>
              <p className="text-muted-foreground text-sm">
                Ruang kelas yang nyaman dengan peralatan pembelajaran modern dan aman untuk anak-anak.
              </p>
            </div>
            <div className="text-center">
              <img src="/kindergarten-playground-with-safe-equipment.png" alt="Area Bermain" className="rounded-lg shadow-md w-full mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Area Bermain</h3>
              <p className="text-muted-foreground text-sm">
                Playground yang aman dan menyenangkan untuk mengembangkan motorik kasar anak.
              </p>
            </div>
            <div className="text-center">
              <img src="/kindergarten-library-with-children-books.png" alt="Perpustakaan" className="rounded-lg shadow-md w-full mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Perpustakaan</h3>
              <p className="text-muted-foreground text-sm">
                Koleksi buku cerita dan edukatif untuk menumbuhkan minat baca sejak dini.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
