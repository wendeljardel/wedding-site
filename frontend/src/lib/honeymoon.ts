/*
  Cotas de lua de mel exibidas em /presentes acima da lista de produtos.
  Para mudar valores, titulos ou subtitulos, edite aqui.
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
    title: 'Cafe da manha pra dois',
    subtitle: 'Pequenos prazeres do comeco do dia',
    amount: 120,
    emoji: '☕',
  },
  {
    id: 'passeio',
    title: 'Passeio inesquecivel',
    subtitle: 'Para vivermos uma aventura juntos',
    amount: 140,
    emoji: '🌅',
  },
  {
    id: 'jantar',
    title: 'Jantar romantico',
    subtitle: 'Para brindar nossa primeira viagem de casados',
    amount: 170,
    emoji: '🍷',
  },
  {
    id: 'valor-livre',
    title: 'Valor livre',
    subtitle: 'O quanto o coracao mandar',
    amount: null,
    emoji: '💛',
  },
]
