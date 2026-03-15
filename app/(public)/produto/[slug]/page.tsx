import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProductSlugs } from '@/services/products'
import { ProductGallery } from '@/components/products/ProductGallery'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { formatCurrency } from '@/lib/utils'
import { Package, Ruler, CircleDollarSign, CheckCircle2, XCircle, Palette, Users } from 'lucide-react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const categoryToTheme: Record<string, string> = {
  casamento:        'casamentos',
  aniversario:      'aniversarios',
  debutante:        'aniversarios',
  'festa-infantil': 'infantil',
  'cha-de-bebe':    'cha',
  'cha-revelacao':  'cha',
}

function catalogHref(slug: string): string {
  const theme = categoryToTheme[slug]
  return theme ? `/catalogo?tema=${theme}` : '/catalogo'
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Produto não encontrado' }
  }

  return {
    title: product.name,
    description:
      product.description ??
      `Alugue ${product.name} para sua festa. ${formatCurrency(product.price_rental)} por evento.`,
    openGraph: {
      title: `${product.name} | Decobalões`,
      description:
        product.description ??
        `Alugue ${product.name} para sua festa.`,
      images: product.images_urls?.[0]
        ? [{ url: product.images_urls[0], alt: product.name }]
        : [],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const hasDimensions = product.height || product.width || product.depth

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Breadcrumb */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-sm text-slate/60 hover:text-slate mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images_urls} productName={product.name} />

          {/* Info */}
          <div>
            {/* Category */}
            {product.categories?.name && (
              <Link
                href={catalogHref(product.categories.slug)}
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 text-[#1E293B] hover:bg-primary-200 transition-colors mb-4"
              >
                {product.categories.name}
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              {product.is_available ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-700">Disponível para aluguel</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-semibold text-red-600">Indisponível no momento</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <CircleDollarSign className="w-5 h-5 text-[#D4AF37] mb-0.5" />
              <span className="text-3xl font-extrabold text-[#D4AF37]">
                {formatCurrency(product.price_rental)}
              </span>
              <span className="text-sm text-slate/50 font-medium">/ evento</span>
            </div>

            {/* Decoration details */}
            {product.product_type === 'decoracao' && (product.color_palette || product.event_size || product.includes_setup) && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.color_palette && (
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#fdf2f8] border border-[#F9A8D4]/20">
                    <Palette className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate/50 uppercase tracking-wide">Paleta de cores</p>
                      <p className="text-sm font-semibold text-slate mt-0.5">{product.color_palette}</p>
                    </div>
                  </div>
                )}
                {product.event_size && (
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#fdf2f8] border border-[#F9A8D4]/20">
                    <Users className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate/50 uppercase tracking-wide">Tamanho do evento</p>
                      <p className="text-sm font-semibold text-slate mt-0.5">
                        {product.event_size === 'pequeno' ? 'Pequeno (até 30 pessoas)' :
                         product.event_size === 'medio' ? 'Médio (30 a 80 pessoas)' :
                         'Grande (acima de 80 pessoas)'}
                      </p>
                    </div>
                  </div>
                )}
                {product.includes_setup && (
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-green-50 border border-green-100 sm:col-span-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Montagem inclusa</p>
                      <p className="text-sm text-green-700 mt-0.5">A decoradora monta e desmonta no local do evento</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-slate/50 uppercase tracking-wider mb-2">
                  Descrição
                </h2>
                <p className="text-slate/70 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Dimensions */}
            {hasDimensions && (
              <div className="mb-8 p-4 rounded-2xl bg-primary-50 border border-primary-100">
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-slate/70 uppercase tracking-wider">
                    Dimensões
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {product.height && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate">{product.height}cm</p>
                      <p className="text-xs text-slate/50">Altura</p>
                    </div>
                  )}
                  {product.width && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate">{product.width}cm</p>
                      <p className="text-xs text-slate/50">Largura</p>
                    </div>
                  )}
                  {product.depth && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate">{product.depth}cm</p>
                      <p className="text-xs text-slate/50">Profundidade</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity info */}
            <div className="flex items-center gap-2 mb-8 text-sm text-slate/60">
              <Package className="w-4 h-4" />
              <span>
                {product.quantity_available} unidade
                {product.quantity_available !== 1 ? 's' : ''} disponível
                {product.quantity_available !== 1 ? 'is' : ''}
              </span>
            </div>

            {/* CTA */}
            <WhatsAppButton
              productName={product.name}
              size="lg"
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
