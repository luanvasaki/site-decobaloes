import { NotFoundMessage } from '@/components/shared/NotFoundMessage'

// notFound() dentro do site público (ex. produto inexistente) — o layout público
// já fornece menu e rodapé
export default function NotFound() {
  return <NotFoundMessage />
}
