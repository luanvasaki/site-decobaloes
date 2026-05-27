export const GALLERY_CATEGORIES = [
  { id: 'casamentos',   label: '💍 Casamentos' },
  { id: 'aniversarios', label: '🎂 Aniversários' },
  { id: 'infantil',     label: '🎠 Festa Infantil' },
  { id: 'cha',          label: '🍼 Chá de Bebê' },
]

export const FALLBACK_PHOTOS: Record<string, { src: string; alt: string }[]> = {
  casamentos: [
    { src: '/festa-3.jpg',  alt: 'Mesa de casamento rústica' },
    { src: '/festa-9.jpg',  alt: 'Mesa de casamento com luzes' },
    { src: '/festa-10.jpg', alt: 'Mesa com rosas vermelhas' },
    { src: '/festa-12.jpg', alt: 'Casamento com flores brancas' },
  ],
  aniversarios: [
    { src: '/festa-2.jpg',  alt: 'Decoração 15 anos rosa' },
    { src: '/festa-5.jpg',  alt: 'Festa com balões rosa' },
    { src: '/festa-11.jpg', alt: 'Debutante Alice no País das Maravilhas' },
    { src: '/festa-1.jpg',  alt: 'Mesa decorada colorida' },
  ],
  infantil: [
    { src: '/festa-4.jpg', alt: 'Festa temática cachorrinho' },
    { src: '/festa-7.jpg', alt: 'Festa Harry Potter' },
  ],
  cha: [
    { src: '/festa-6.jpg', alt: 'Chá de bebê verde e dourado' },
  ],
}
