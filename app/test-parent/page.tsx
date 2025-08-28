"use client"

export default function SimpleParentTest() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#4caf50',
      color: 'white',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>
        🎉 HALLO 1!
      </h1>
      <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>
        Selamat Datang di Halaman Orang Tua
      </h2>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        marginTop: '30px'
      }}>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>✅ HALAMAN BERHASIL TAMPIL!</h3>
        <div style={{ textAlign: 'left', fontSize: '18px' }}>
          <p><strong>Status:</strong> Halaman parent dashboard berhasil di-render</p>
          <p><strong>URL:</strong> /test-parent</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        fontSize: '16px'
      }}>
        <p><strong>TEST BERHASIL:</strong> Halaman hijau dengan pesan selamat datang!</p>
      </div>
    </div>
  )
}
