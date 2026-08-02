/*
  Cotas de lua de mel exibidas em /presentes acima da lista de produtos.
  Para mudar valores, titulos ou subtitulos, edite aqui.
  Mantenha os textos acentuados: eles aparecem direto para o convidado.
*/
export interface HoneymoonCota {
  id: string
  title: string
  subtitle: string
  amount: number | null
  emoji: string
}

export const HONEYMOON_COTAS: HoneymoonCota[] = [
  {
    id: 'cafe-da-manha',
    title: 'Café da manhã para dois',
    subtitle: 'Pequenos prazeres do começo do dia',
    amount: 140,
    emoji: '☕',
  },
  {
    id: 'passeio',
    title: 'Passeio inesquecível',
    subtitle: 'Para vivermos uma aventura juntos',
    amount: 160,
    emoji: '🌅',
  },
  {
    id: 'jantar',
    title: 'Jantar romântico',
    subtitle: 'Para brindar nossa primeira viagem de casados',
    amount: 190,
    emoji: '🍷',
  },
  {
    id: 'valor-livre',
    title: 'Valor livre',
    subtitle: 'O quanto o coração mandar',
    amount: null,
    emoji: '💛',
  },
]
