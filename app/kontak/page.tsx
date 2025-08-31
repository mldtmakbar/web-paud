"use client"

import type React from "react"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function KontakPage() {

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Alamat",
      content: "Jl. Damai 3 No.06 Blok M12\nRT.12/RW.36, Bahagia, Kec. Babelan\nKabupaten Bekasi, Jawa Barat 17610",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Telepon",
      content: "081295932008",
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      content: "paudanidabekasi@gmail.com",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Jam Operasional",
      content: "Senin - Jumat: 09:00 - 17:00",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6 font-serif">Hubungi Kami</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Kami siap membantu Anda dengan informasi lebih lanjut tentang program pendidikan dan proses pendaftaran di
            TK Anida.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{info.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">{info.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Map and Additional Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Lokasi Kami</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0236080193334!2d107.02780741430736!3d-6.180720263780979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d3e8b8b8b8b%3A0x1234567890abcdef!2sJl.%20Damai%203%20No.06%20Blok%20M12%2C%20RT.12%2FRW.36%2C%20Bahagia%2C%20Kec.%20Babelan%2C%20Kabupaten%20Bekasi%2C%20Jawa%20Barat%2017610!5e0!3m2!1sen!2sid!4v1629876543210!5m2!1sen!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi TK Anida"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      TK Anida berlokasi strategis di Bekasi dengan akses mudah menggunakan transportasi umum
                      maupun kendaraan pribadi.
                    </p>
                    <a
                      href="https://maps.app.goo.gl/KNMem1SmgaxoWpkt9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium ml-4 whitespace-nowrap"
                    >
                      Buka di Maps →
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Informasi Pendaftaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Periode Pendaftaran</h4>
                      <p className="text-muted-foreground text-sm">
                        Januari - Maret: Pendaftaran gelombang 1<br />
                        April - Juni: Pendaftaran gelombang 2
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Syarat Pendaftaran</h4>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>• Usia minimal 4 tahun</li>
                        <li>• Fotokopi akta kelahiran</li>
                        <li>• Fotokopi KK dan KTP orang tua</li>
                        <li>• Pas foto anak 3x4 (2 lembar)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
