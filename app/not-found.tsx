import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsAppButton } from '@/components/shared/FloatingWhatsAppButton'
import { NotFoundMessage } from '@/components/shared/NotFoundMessage'

// Endereços que não existem caem aqui, fora do layout público — por isso a
// página monta o próprio menu e rodapé, para o visitante não ficar sem saída
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <NotFoundMessage />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  )
}
