import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="font-bold text-xl text-foreground font-serif">TK Anida</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              TK Anida adalah taman kanak-kanak yang berkomitmen memberikan pendidikan berkualitas dengan pendekatan
              yang menyenangkan dan mengembangkan potensi setiap anak.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Jl. Damai 3 No.06 Blok M12, RT.12/RW.36
                  <br />
                  Bahagia, Kec. Babelan, Kabupaten Bekasi
                  <br />
                  Jawa Barat 17610
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground text-sm">081295932008</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground text-sm">paudanidabekasi@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Jam Operasional</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-muted-foreground text-sm">
                  <div>Senin - Jumat</div>
                  <div>09:00 - 17:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 TK Anida. Semua hak dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  )
}
