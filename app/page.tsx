import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Users, BookOpen, Heart, Award, ArrowRight } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Guru Berpengalaman",
      description: "Tim pengajar profesional dengan pengalaman dalam pendidikan anak usia dini",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Kurikulum Terpadu",
      description: "Pembelajaran yang menggabungkan akademik, kreativitas, dan pengembangan karakter",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Lingkungan Aman",
      description: "Fasilitas yang aman dan nyaman untuk mendukung tumbuh kembang anak",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Prestasi Terbaik",
      description: "Lulusan TK Ceria siap melanjutkan ke jenjang pendidikan selanjutnya",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                Selamat Datang di <span className="text-primary">TK Ceria</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Tempat terbaik untuk memulai perjalanan pendidikan anak Anda. Kami menyediakan lingkungan belajar yang
                menyenangkan, aman, dan mendukung perkembangan optimal setiap anak.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/kontak">Daftar Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/tentang">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/happy-children-playing-in-kindergarten-classroom-c.png"
                alt="Anak-anak bermain di TK Ceria"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Mengapa Memilih TK Ceria?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan pendidikan terbaik dengan pendekatan yang holistik untuk mengembangkan potensi
              setiap anak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-serif">Siap Bergabung dengan Keluarga TK Ceria?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Berikan yang terbaik untuk masa depan anak Anda. Hubungi kami untuk informasi lebih lanjut tentang program
            dan pendaftaran.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/kontak" className="inline-flex items-center">
              Hubungi Kami <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
