'use client'

import { useEffect, useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'
import type { GalleryPhoto } from '@/services/gallery'
import { setHeroImageAction } from '@/app/actions/settings'
import { Upload, Trash2, Loader2, ImageIcon, Star, Check } from 'lucide-react'

export default function AdminGaleriaPage() {
  const [activeTab, setActiveTab] = useState('casamentos')
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [currentHeroUrl, setCurrentHeroUrl] = useState<string | null>(null)
  const [settingHero, setSettingHero] = useState<string | null>(null)
  const [heroSuccess, setHeroSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  // Load current hero from settings
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_image_url')
      .single()
      .then(({ data }) => {
        if (data?.value) setCurrentHeroUrl(data.value)
      })
  }, [])

  async function fetchPhotos() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('category', activeTab)
      .order('created_at', { ascending: false })
    setPhotos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPhotos() }, [activeTab])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    const supabase = createClient()

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `gallery/${activeTab}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        await supabase.from('gallery_photos').insert({
          category: activeTab,
          image_url: data.publicUrl,
        })
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploading(false)
    fetchPhotos()
  }

  async function handleDelete(photo: GalleryPhoto) {
    if (!confirm('Remover esta foto da galeria?')) return
    setDeletingId(photo.id)
    const supabase = createClient()
    await supabase.from('gallery_photos').delete().eq('id', photo.id)
    setDeletingId(null)
    fetchPhotos()
  }

  async function handleSetHero(photo: GalleryPhoto) {
    setSettingHero(photo.id)
    startTransition(async () => {
      const result = await setHeroImageAction(photo.image_url)
      if (result.ok) {
        setCurrentHeroUrl(photo.image_url)
        setHeroSuccess(photo.id)
        setTimeout(() => setHeroSuccess(null), 2500)
      }
      setSettingHero(null)
    })
  }

  const isCurrentHero = (url: string) => url === currentHeroUrl

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1E293B]">Galeria de Fotos</h1>
        <p className="text-slate/50 text-sm mt-1">
          As fotos aparecem na galeria da página inicial <strong>e no catálogo</strong> por categoria. Adicione ou remova fotos à vontade.
        </p>
      </div>

      {/* ── Foto de Capa do Site ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-[#F9A8D4]" />
          <h2 className="text-base font-bold text-[#1E293B]">Foto de Capa do Site</h2>
        </div>

        {currentHeroUrl ? (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative w-40 h-28 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#F9A8D4]">
              <Image
                src={currentHeroUrl}
                alt="Foto de capa atual"
                fill
                className="object-cover object-[center_30%]"
                sizes="160px"
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-sm font-semibold text-[#1E293B]">Foto atual selecionada como capa</p>
              <p className="text-xs text-slate/50 break-all">{currentHeroUrl}</p>
              <p className="text-xs text-slate/40 mt-1">
                Para trocar, clique em qualquer foto da galeria abaixo e selecione{' '}
                <strong className="text-[#1E293B]">"Usar como capa do site"</strong>.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate/40">Nenhuma foto de capa definida ainda.</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === cat.id
                ? 'bg-[#F9A8D4] text-[#1E293B]'
                : 'bg-white border border-slate/15 text-slate/60 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6">
        {/* Upload */}
        <div className="mb-6">
          <label className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all w-fit ${
            uploading
              ? 'border-slate/20 text-slate/30 cursor-not-allowed'
              : 'border-[#F9A8D4] text-[#1E293B] hover:bg-[#F9A8D4]/10'
          }`}>
            {uploading
              ? <Loader2 className="w-5 h-5 animate-spin text-[#F9A8D4]" />
              : <Upload className="w-5 h-5 text-[#F9A8D4]" />
            }
            <span className="font-bold text-sm">
              {uploading ? 'Enviando...' : 'Adicionar fotos'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          <p className="text-xs text-slate/40 mt-2">Pode selecionar várias fotos de uma vez</p>
        </div>

        {/* Photos grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#F9A8D4]" />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate/30 gap-3">
            <ImageIcon className="w-12 h-12" />
            <p className="font-semibold text-sm">Nenhuma foto nesta categoria</p>
            <p className="text-xs">Clique em "Adicionar fotos" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => {
              const isCover = isCurrentHero(photo.image_url)
              const isSettingThis = settingHero === photo.id
              const justSet = heroSuccess === photo.id

              return (
                <div key={photo.id} className={`relative group aspect-square rounded-xl overflow-hidden ${isCover ? 'ring-2 ring-[#F9A8D4]' : ''}`}>
                  <Image
                    src={photo.image_url}
                    alt="Foto da galeria"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />

                  {/* Badge: foto atual de capa */}
                  {isCover && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F9A8D4] text-[#1E293B] text-xs font-bold shadow">
                      <Star className="w-3 h-3" />
                      Capa
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {/* Botão usar como capa */}
                    {!isCover && (
                      <button
                        onClick={() => handleSetHero(photo)}
                        disabled={isSettingThis || isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9A8D4] text-[#1E293B] text-xs font-bold hover:bg-pink-300 transition-colors disabled:opacity-60"
                      >
                        {isSettingThis
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : justSet
                          ? <Check className="w-3 h-3" />
                          : <Star className="w-3 h-3" />
                        }
                        {justSet ? 'Definida!' : 'Usar como capa'}
                      </button>
                    )}

                    {/* Botão deletar */}
                    <button
                      onClick={() => handleDelete(photo)}
                      disabled={deletingId === photo.id}
                      aria-label="Remover foto"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      {deletingId === photo.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Trash2 className="w-3 h-3" />
                      }
                      Remover
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
