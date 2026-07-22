'use client'

import { useEffect, useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'
import type { GalleryPhoto } from '@/services/gallery'
import { setHeroImagesAction, setHomepageImagesAction, setServiceTitlesAction } from '@/app/actions/settings'
import { SERVICE_TITLES_FALLBACK } from '@/lib/service-constants'
import { Upload, Trash2, Loader2, ImageIcon, Star, Check, Home, X, ArrowUp, ArrowDown, Type } from 'lucide-react'

export default function AdminGaleriaPage() {
  const [activeTab, setActiveTab] = useState('casamentos')
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [homepageImages, setHomepageImages] = useState<string[]>([])
  const [serviceTitles, setServiceTitles] = useState<string[]>(SERVICE_TITLES_FALLBACK)
  const [savingTitles, setSavingTitles] = useState(false)
  const [titlesSaved, setTitlesSaved] = useState(false)
  const [heroSuccess, setHeroSuccess] = useState<string | null>(null)
  const [homepageSuccess, setHomepageSuccess] = useState<string | null>(null)
  const [heroUnsaved, setHeroUnsaved] = useState(false)
  const [homepageUnsaved, setHomepageUnsaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const heroSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const homepageSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Salva com um pequeno atraso (debounce), sempre com o estado mais recente —
  // evita que cliques rápidos em sequência gravem fora de ordem e sobrescrevam
  // um estado mais novo com um mais antigo.
  function updateHeroImages(updater: (prev: string[]) => string[]) {
    let next: string[] = []
    setHeroImages((prev) => {
      next = updater(prev)
      return next
    })
    setHeroUnsaved(true)
    if (heroSaveTimer.current) clearTimeout(heroSaveTimer.current)
    heroSaveTimer.current = setTimeout(() => {
      startTransition(async () => {
        await setHeroImagesAction(next)
        setHeroUnsaved(false)
      })
    }, 600)
  }

  function updateHomepageImages(updater: (prev: string[]) => string[]) {
    let next: string[] = []
    setHomepageImages((prev) => {
      next = updater(prev)
      return next
    })
    setHomepageUnsaved(true)
    if (homepageSaveTimer.current) clearTimeout(homepageSaveTimer.current)
    homepageSaveTimer.current = setTimeout(() => {
      startTransition(async () => {
        await setHomepageImagesAction(next)
        setHomepageUnsaved(false)
      })
    }, 600)
  }

  // Avisa antes de sair da página (fechar aba, recarregar, digitar outra URL)
  // se ainda houver uma gravação pendente — a causa real do problema relatado:
  // sair rápido demais podia cancelar a gravação em andamento.
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (heroUnsaved || homepageUnsaved) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [heroUnsaved, homepageUnsaved])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_images', 'homepage_images', 'service_titles'])
      .then(({ data }) => {
        data?.forEach((row) => {
          if (row.key === 'hero_images') {
            try { setHeroImages(JSON.parse(row.value) ?? []) } catch { /* empty */ }
          }
          if (row.key === 'homepage_images') {
            try { setHomepageImages(JSON.parse(row.value) ?? []) } catch { /* empty */ }
          }
          if (row.key === 'service_titles') {
            try {
              const parsed = JSON.parse(row.value)
              if (Array.isArray(parsed) && parsed.length === 4) setServiceTitles(parsed)
            } catch { /* empty */ }
          }
        })
      })
  }, [])

  function handleTitleChange(index: number, value: string) {
    setServiceTitles((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  async function handleSaveTitles() {
    setSavingTitles(true)
    const result = await setServiceTitlesAction(serviceTitles)
    setSavingTitles(false)
    if (result.ok) {
      setTitlesSaved(true)
      setTimeout(() => setTitlesSaved(false), 2500)
    }
  }

  async function fetchPhotos() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('category', activeTab)
      .order('sort_order', { ascending: true })
    setPhotos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPhotos() }, [activeTab])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const MAX_PHOTO_MB = 10
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const tooLarge = files.filter((f) => f.size > MAX_PHOTO_MB * 1024 * 1024)
    const ok = files.filter((f) => f.size <= MAX_PHOTO_MB * 1024 * 1024)
    if (tooLarge.length > 0) {
      alert(`${tooLarge.length === 1 ? 'A foto' : 'As fotos'} ${tooLarge.map((f) => f.name).join(', ')} ${tooLarge.length === 1 ? 'passa' : 'passam'} de ${MAX_PHOTO_MB}MB e não ${tooLarge.length === 1 ? 'foi' : 'foram'} enviada${tooLarge.length === 1 ? '' : 's'}. Tente uma versão menor.`)
    }
    if (ok.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploading(true)
    const supabase = createClient()
    let nextOrder = photos.length > 0 ? Math.max(...photos.map((p) => p.sort_order)) + 1 : 0
    const failed: string[] = []

    for (const file of ok) {
      const ext = file.name.split('.').pop()
      const path = `gallery/${activeTab}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file, { upsert: true })

        if (!uploadError) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(path)
          await supabase.from('gallery_photos').insert({
            category: activeTab,
            image_url: data.publicUrl,
            sort_order: nextOrder++,
          })
        } else {
          failed.push(file.name)
        }
      } catch {
        failed.push(file.name)
      }
    }

    if (failed.length > 0) {
      alert(`Não foi possível enviar: ${failed.join(', ')}. Tente novamente ou use uma imagem menor.`)
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
    // Remove from homepage images if present
    const newList = homepageImages.filter((u) => u !== photo.image_url)
    if (newList.length !== homepageImages.length) {
      setHomepageImages(newList)
      startTransition(async () => { await setHomepageImagesAction(newList) })
    }
    // Remove from hero images if present
    const newHeroList = heroImages.filter((u) => u !== photo.image_url)
    if (newHeroList.length !== heroImages.length) {
      setHeroImages(newHeroList)
      startTransition(async () => { await setHeroImagesAction(newHeroList) })
    }
    setDeletingId(null)
    fetchPhotos()
  }

  function handleToggleHero(photo: GalleryPhoto) {
    updateHeroImages((prev) =>
      prev.includes(photo.image_url)
        ? prev.filter((u) => u !== photo.image_url)
        : [...prev, photo.image_url]
    )
    setHeroSuccess(photo.id)
    setTimeout(() => setHeroSuccess(null), 2000)
  }

  function handleRemoveFromHero(url: string) {
    updateHeroImages((prev) => prev.filter((u) => u !== url))
  }

  function handleMoveHero(index: number, direction: -1 | 1) {
    updateHeroImages((prev) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= prev.length) return prev

      const newList = [...prev]
      const [moved] = newList.splice(index, 1)
      newList.splice(targetIndex, 0, moved)
      return newList
    })
  }

  function handleToggleHomepage(photo: GalleryPhoto) {
    updateHomepageImages((prev) =>
      prev.includes(photo.image_url)
        ? prev.filter((u) => u !== photo.image_url)
        : [...prev, photo.image_url]
    )
    setHomepageSuccess(photo.id)
    setTimeout(() => setHomepageSuccess(null), 2000)
  }

  function handleMove(index: number, direction: -1 | 1) {
    setPhotos((prev) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= prev.length) return prev

      const current = prev[index]
      const target = prev[targetIndex]

      const reordered = [...prev]
      reordered[index] = target
      reordered[targetIndex] = current

      const supabase = createClient()
      Promise.all([
        supabase.from('gallery_photos').update({ sort_order: target.sort_order }).eq('id', current.id),
        supabase.from('gallery_photos').update({ sort_order: current.sort_order }).eq('id', target.id),
      ])

      return reordered
    })
  }

  function handleRemoveFromHomepage(url: string) {
    updateHomepageImages((prev) => prev.filter((u) => u !== url))
  }

  function handleMoveHomepage(index: number, direction: -1 | 1) {
    updateHomepageImages((prev) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= prev.length) return prev

      const newList = [...prev]
      const [moved] = newList.splice(index, 1)
      newList.splice(targetIndex, 0, moved)
      return newList
    })
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1E293B]">Galeria de Fotos</h1>
        <p className="text-slate/50 text-sm mt-1">
          Gerencie as fotos da galeria, da capa e da página inicial do site.
        </p>
      </div>

      {/* ── Fotos de Capa (Hero) ── */}
      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-[#F9A8D4]" />
          <h2 className="text-base font-bold text-[#1E293B]">Fotos de Capa (Hero)</h2>
          {heroUnsaved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37]">
              <Loader2 className="w-3 h-3 animate-spin" /> Salvando... não saia da página
            </span>
          )}
        </div>
        <p className="text-xs text-slate/40 mb-4">
          A foto principal do topo da página inicial. Se você adicionar <strong className="text-[#1E293B]">mais de uma foto</strong>, elas ficam alternando automaticamente a cada poucos segundos. Use as setas para definir a ordem. Para adicionar, clique em qualquer foto da galeria abaixo e selecione <strong className="text-[#1E293B]">&quot;Adicionar à capa&quot;</strong>.
        </p>

        {heroImages.length === 0 ? (
          <p className="text-sm text-slate/40">Nenhuma foto de capa definida ainda — usando a foto padrão do site.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {heroImages.map((url, i) => (
              <div key={url} className="relative group">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#F9A8D4]">
                  <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#F9A8D4] flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-[#1E293B]">{i + 1}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveHero(i, -1)}
                      disabled={i === 0}
                      aria-label="Mover para a esquerda"
                      className="w-6 h-6 rounded-lg bg-white/90 text-[#1E293B] flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    >
                      <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveHero(i, 1)}
                      disabled={i === heroImages.length - 1}
                      aria-label="Mover para a direita"
                      className="w-6 h-6 rounded-lg bg-white/90 text-[#1E293B] flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    >
                      <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFromHero(url)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  aria-label="Remover"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Fotos da Página Inicial ── */}
      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-base font-bold text-[#1E293B]">Fotos da Página Inicial</h2>
          {homepageUnsaved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37]">
              <Loader2 className="w-3 h-3 animate-spin" /> Salvando... não saia da página
            </span>
          )}
        </div>
        <p className="text-xs text-slate/40 mb-4">
          Essas fotos aparecem na seção de serviços e no portfólio da página inicial. A ordem importa: a <strong className="text-[#1E293B]">1ª foto</strong> vira o card de <strong className="text-[#1E293B]">{serviceTitles[0]}</strong>, a <strong className="text-[#1E293B]">2ª</strong> de <strong className="text-[#1E293B]">{serviceTitles[1]}</strong>, a <strong className="text-[#1E293B]">3ª</strong> de <strong className="text-[#1E293B]">{serviceTitles[2]}</strong> e a <strong className="text-[#1E293B]">4ª</strong> de <strong className="text-[#1E293B]">{serviceTitles[3]}</strong> — use as setas para ajustar. Os nomes desses cards podem ser editados logo abaixo. As 5 primeiras fotos também vão para o portfólio. Para adicionar, clique em qualquer foto da galeria e selecione <strong className="text-[#1E293B]">&quot;Página inicial&quot;</strong>.
        </p>

        {homepageImages.length === 0 ? (
          <p className="text-sm text-slate/40">Nenhuma foto selecionada — usando fotos padrão do site.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {homepageImages.map((url, i) => (
              <div key={url} className="relative group">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#D4AF37]">
                  <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-white">{i + 1}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveHomepage(i, -1)}
                      disabled={i === 0}
                      aria-label="Mover para a esquerda"
                      className="w-6 h-6 rounded-lg bg-white/90 text-[#1E293B] flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    >
                      <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveHomepage(i, 1)}
                      disabled={i === homepageImages.length - 1}
                      aria-label="Mover para a direita"
                      className="w-6 h-6 rounded-lg bg-white/90 text-[#1E293B] flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    >
                      <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                  </div>
                </div>
                {i < 4 && (
                  <p className="text-[10px] text-center text-slate/40 mt-1 leading-tight">
                    {serviceTitles[i]}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveFromHomepage(url)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  aria-label="Remover"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Nomes dos Cards de Serviço ── */}
      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Type className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-base font-bold text-[#1E293B]">Nomes dos Cards de Serviço</h2>
        </div>
        <p className="text-xs text-slate/40 mb-4">
          Título exibido em cada um dos 4 cards da seção &quot;Especialidades&quot; da página inicial.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {serviceTitles.map((title, i) => (
            <input
              key={i}
              value={title}
              onChange={(e) => handleTitleChange(i, e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate/15 text-sm focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 focus:border-[#F9A8D4]"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleSaveTitles}
          disabled={savingTitles}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E293B] text-white text-xs font-bold hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          {savingTitles ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : titlesSaved ? <Check className="w-3.5 h-3.5" /> : null}
          {savingTitles ? 'Salvando...' : titlesSaved ? 'Salvo!' : 'Salvar nomes'}
        </button>
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
            <p className="text-xs">Clique em &quot;Adicionar fotos&quot; para começar</p>
          </div>
        ) : (
          <>
          <p className="text-xs text-slate/40 mb-3">Use as setas para organizar a ordem em que as fotos aparecem no site.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo, index) => {
              const isCover = heroImages.includes(photo.image_url)
              const isOnHomepage = homepageImages.includes(photo.image_url)
              const justSetHero = heroSuccess === photo.id
              const justSetHomepage = homepageSuccess === photo.id

              return (
                <div
                  key={photo.id}
                  className={`relative group aspect-square rounded-xl overflow-hidden ${
                    isCover ? 'ring-2 ring-[#F9A8D4]' : isOnHomepage ? 'ring-2 ring-[#D4AF37]' : ''
                  }`}
                >
                  <Image
                    src={photo.image_url}
                    alt="Foto da galeria"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />

                  {/* Reorder controls */}
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      aria-label="Mover para cima"
                      className="w-6 h-6 rounded-lg bg-white/90 text-[#1E293B] flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === photos.length - 1}
                      aria-label="Mover para baixo"
                      className="w-6 h-6 rounded-lg bg-white/90 text-[#1E293B] flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {isCover && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F9A8D4] text-[#1E293B] text-xs font-bold shadow">
                        <Star className="w-3 h-3" />
                        Capa {heroImages.indexOf(photo.image_url) + 1}º
                      </div>
                    )}
                    {isOnHomepage && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37] text-white text-xs font-bold shadow">
                        <Home className="w-3 h-3" />
                        {homepageImages.indexOf(photo.image_url) + 1}º
                      </div>
                    )}
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {/* Capa (Hero) */}
                    <button
                      onClick={() => handleToggleHero(photo)}
                      disabled={isPending}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60 ${
                        isCover
                          ? 'bg-[#F9A8D4] text-[#1E293B] hover:bg-pink-300'
                          : 'bg-white/90 text-[#1E293B] hover:bg-white'
                      }`}
                    >
                      {justSetHero ? <Check className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                      {justSetHero ? (isCover ? 'Adicionada!' : 'Removida!') : isCover ? 'Remover da capa' : 'Adicionar à capa'}
                    </button>

                    {/* Página inicial */}
                    <button
                      onClick={() => handleToggleHomepage(photo)}
                      disabled={isPending}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60 ${
                        isOnHomepage
                          ? 'bg-[#D4AF37] text-white hover:bg-yellow-600'
                          : 'bg-white/90 text-[#1E293B] hover:bg-white'
                      }`}
                    >
                      {justSetHomepage ? <Check className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                      {justSetHomepage ? (isOnHomepage ? 'Adicionada!' : 'Removida!') : isOnHomepage ? 'Remover da pág. inicial' : 'Página inicial'}
                    </button>

                    {/* Deletar */}
                    <button
                      onClick={() => handleDelete(photo)}
                      disabled={deletingId === photo.id}
                      aria-label="Remover foto"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      {deletingId === photo.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Remover
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          </>
        )}
      </div>
    </div>
  )
}
