'use client' // 👈 Wajib jika menggunakan hook (useParams)

import { useParams } from 'next/navigation'; // 👈 Import useParams

export default function PostPage() {
  const params = useParams(); 
  // Ambil parameter dari objek params. Nama properti harus sesuai ([id] -> id)
  const { id } = params; 

  return (
    <div>
      <h1>Konten Post</h1>
      <p>ID Post yang diminta: {id}</p>
    </div>
  );
}