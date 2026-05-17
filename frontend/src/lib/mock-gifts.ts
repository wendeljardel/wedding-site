import type { Gift } from './api'

/*
  Dados de exemplo usados quando a API ainda nao esta no ar
  (ou no preview/dev sem backend). Em producao, o useEffect na
  pagina Gifts puxa da API e ignora isto.
*/
export const MOCK_GIFTS: Gift[] = [
  {
    giftId: 'jogo-de-panelas',
    name: 'Jogo de panelas',
    description: 'Conjunto Tramontina antiaderente, 7 pecas',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600',
    price: 489.9,
    storeUrl: 'https://www.amazon.com.br/dp/example1',
    status: 'available',
  },
  {
    giftId: 'cafeteira-italiana',
    name: 'Cafeteira italiana',
    description: 'Moka Bialetti 6 xicaras',
    imageUrl: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600',
    price: 219.0,
    storeUrl: 'https://www.amazon.com.br/dp/example2',
    status: 'claimed',
  },
  {
    giftId: 'jogo-de-toalhas',
    name: 'Jogo de toalhas',
    description: '4 toalhas de banho 100% algodao egipcio',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b4220292?w=600',
    price: 329.0,
    storeUrl: 'https://www.amazon.com.br/dp/example3',
    status: 'available',
  },
  {
    giftId: 'liquidificador',
    name: 'Liquidificador',
    description: 'Philco PH900 1200W',
    imageUrl: 'https://images.unsplash.com/photo-1622480500638-5fb45e0f0f88?w=600',
    price: 459.0,
    storeUrl: 'https://www.amazon.com.br/dp/example4',
    status: 'available',
  },
]
