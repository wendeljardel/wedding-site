export interface GalleryPhoto {
  /** nome do arquivo em public/photos/historia, sem extensao */
  slug: string
  /** dimensoes da versao do mural, usadas para reservar o espaco antes do carregamento */
  width: number
  height: number
  alt: string
}

/**
 * Gerado por scripts/optimize-photos.py. Para trocar ou acrescentar fotos, coloque
 * o original em assets/photos-originais, ajuste a lista PHOTOS do script, rode-o e
 * cole aqui a saida.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { slug: 'historia-01', width: 700, height: 1198,
    alt: 'Thamires e Wendel na formatura' },
  { slug: 'historia-02', width: 700, height: 525,
    alt: 'Thamires e Wendel em um jantar, com flores na mesa' },
  { slug: 'historia-03', width: 700, height: 933,
    alt: 'Thamires e Wendel em uma saída à noite' },
  { slug: 'historia-04', width: 700, height: 933,
    alt: 'Thamires e Wendel em um dia de praia' },
  { slug: 'historia-05', width: 700, height: 944,
    alt: 'Thamires e Wendel em uma festa de rua' },
  { slug: 'historia-06', width: 700, height: 933,
    alt: 'Thamires e Wendel no Cristo Redentor, no Rio de Janeiro' },
  { slug: 'historia-07', width: 700, height: 700,
    alt: 'Thamires estendendo a mão para Wendel em uma biblioteca antiga' },
  { slug: 'historia-08', width: 700, height: 525,
    alt: 'Wendel carregando Thamires no colo em frente ao letreiro do Rock in Rio' },
  { slug: 'historia-09', width: 700, height: 1244,
    alt: 'Thamires e Wendel em uma festa, ela de vestido azul' },
  { slug: 'historia-10', width: 700, height: 1244,
    alt: 'Thamires e Wendel em um jardim florido' },
  { slug: 'historia-11', width: 700, height: 935,
    alt: 'Thamires e Wendel abraçados sob um pier, na beira do mar' },
  { slug: 'historia-12', width: 700, height: 933,
    alt: 'Thamires e Wendel em um momento a dois à noite' },
  { slug: 'historia-13', width: 700, height: 933,
    alt: 'Thamires e Wendel no Real Gabinete Português de Leitura, no Rio de Janeiro' },
]

export const thumbUrl = (slug: string) => `/photos/historia/${slug}-sm.webp`
export const fullUrl = (slug: string) => `/photos/historia/${slug}.webp`
