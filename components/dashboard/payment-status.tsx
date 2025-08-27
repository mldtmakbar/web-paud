import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Payment, formatCurrency } from "@/lib/mock-data"
import { CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface PaymentStatusProps {
  payments: Payment[]
}

export default function PaymentStatus({ payments }: PaymentStatusProps) {
  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Lunas</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500 text-white">Terlambat</Badge>
    }
  }

  const totalPaid = payments.filter((p) => p.status === "paid").length
  const totalPending = payments.filter((p) => p.status === "pending").length
  const totalOverdue = payments.filter((p) => p.status === "overdue").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Lunas</p>
                <p className="text-2xl font-bold text-green-500">{totalPaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Terlambat</p>
                <p className="text-2xl font-bold text-red-500">{totalOverdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Data Tagihan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-600 hover:bg-red-600">
                  <TableHead className="text-white font-semibold">Tahun Ajaran/Semester</TableHead>
                  <TableHead className="text-white font-semibold">Semester Perkuliahan</TableHead>
                  <TableHead className="text-white font-semibold">UP3</TableHead>
                  <TableHead className="text-white font-semibold">SDP2</TableHead>
                  <TableHead className="text-white font-semibold">BPP Paket</TableHead>
                  <TableHead className="text-white font-semibold">BPP Non Paket</TableHead>
                  <TableHead className="text-white font-semibold">SKS</TableHead>
                  <TableHead className="text-white font-semibold">Perpustakaan</TableHead>
                  <TableHead className="text-white font-semibold">Mangkir</TableHead>
                  <TableHead className="text-white font-semibold">Uang Status</TableHead>
                  <TableHead className="text-white font-semibold">Biaya Kesehatan</TableHead>
                  <TableHead className="text-white font-semibold">Asrama</TableHead>
                  <TableHead className="text-white font-semibold">Total</TableHead>
                  <TableHead className="text-white font-semibold">Potongan</TableHead>
                  <TableHead className="text-white font-semibold">Beasiswa</TableHead>
                  <TableHead className="text-white font-semibold">Total Tagihan</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow
                    key={payment.id}
                    className={
                      payment.status === "paid"
                        ? "bg-green-50"
                        : payment.status === "overdue"
                          ? "bg-red-50"
                          : "bg-yellow-50"
                    }
                  >
                    <TableCell className="font-medium">
                      {payment.tahun_ajaran} - {payment.semester === 1 ? "GANJIL" : "GENAP"}
                    </TableCell>
                    <TableCell>{payment.semester}</TableCell>
                    <TableCell>{formatCurrency(payment.up3)}</TableCell>
                    <TableCell>{formatCurrency(payment.sdp2)}</TableCell>
                    <TableCell>{formatCurrency(payment.bpp_paket)}</TableCell>
                    <TableCell>{formatCurrency(payment.bpp_non_paket)}</TableCell>
                    <TableCell>{formatCurrency(payment.sks)}</TableCell>
                    <TableCell>{formatCurrency(payment.perpustakaan)}</TableCell>
                    <TableCell>{formatCurrency(payment.mangkir)}</TableCell>
                    <TableCell>{formatCurrency(payment.uang_status)}</TableCell>
                    <TableCell>{formatCurrency(payment.biaya_kesehatan)}</TableCell>
                    <TableCell>{formatCurrency(payment.asrama)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(payment.total)}</TableCell>
                    <TableCell>{formatCurrency(payment.potongan)}</TableCell>
                    <TableCell>{formatCurrency(payment.beasiswa)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(payment.total_tagihan)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {payments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Tidak ada data pembayaran</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
