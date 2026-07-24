import Link from 'next/link'
import Image from 'next/image'
import { Instagram, MapPin, Phone, Mail, Lock } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/whatsapp'

export function Footer() {
  return (
    <footer className="bg-[#1E293B] text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Decobalões"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-xl font-extrabold">
                Deco<span className="text-[#D4AF37]">balões</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transformamos festas em momentos mágicos com decorações únicas e
              cheias de personalidade.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-[#D4AF37] mb-4 uppercase tracking-wider text-xs">
              Navegação
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/sobre', label: 'Sobre nós' },
                { href: '/contato', label: 'Contato' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#F9A8D4] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[#D4AF37] mb-4 uppercase tracking-wider text-xs">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-[#F9A8D4] mt-0.5 shrink-0" />
                <span>São Miguel Arcanjo — SP</span>
              </li>
              <li>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F9A8D4] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F9A8D4] shrink-0" />
                  <span>(15) 9 9620-4192</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:miriamvasaki@gmail.com"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F9A8D4] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#F9A8D4] shrink-0" />
                  <span>miriamvasaki@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/miriam_vasaki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F9A8D4] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#F9A8D4] shrink-0" />
                  <span>@miriam_vasaki</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Decobalões. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            <p>Feito com 🎈 para festas inesquecíveis</p>
            <Link
              href="/admin"
              className="text-slate-700/30 hover:text-slate-500 transition-colors"
              aria-label="Área administrativa"
              title="Área administrativa"
            >
              <Lock className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
