import type { Gift } from './api'

/*
  Dados de exemplo usados quando a API ainda nao esta no ar.
  Em producao, o useEffect na pagina Gifts puxa da API e ignora isto.
  Mantenha em sincronia com infra/seed-gifts.json.
*/
export const MOCK_GIFTS: Gift[] = [
  {
    giftId: 'kit-tapete-passadeira-missoni',
    name: 'Kit tapete + passadeira Missoni',
    description:
      'Conjunto de tapete 65 cm + passadeira 1,10 m com base antiderrapante, padrão Missoni cinza. Casa Bergan.',
    imageUrl:
      'https://casabergan.fbitsstatic.net/img/p/kit-tapete-para-cozinha-65cm-passadeira-1-10m-missoni-antiderrapante-2-pecas-154653/350042-1.jpg?w=620&h=620',
    price: 129.9,
    storeUrl:
      'https://www.casabergan.com.br/produto/kit-tapete-para-cozinha-65cm-passadeira-1-10m-missoni-antiderrapante-2-pecas-154653?idvariant=Cinza',
    status: 'available',
  },
  {
    giftId: 'passadeira-listras-preto',
    name: 'Passadeira de algodão',
    description:
      'Passadeira artesanal listrada preto e off-white, 0,60 x 1,40 m, em algodão reciclado com base antiderrapante. Casa Cortilla.',
    imageUrl:
      'https://images.tcdn.com.br/img/img_prod/1383951/passadeira_listras_preto_1_20250829071649_603f725568e1.jpg',
    price: 187.0,
    storeUrl:
      'https://www.casacortilla.com.br/tapetes/passadeiras/passadeira-listras-preto-antiderrapante?variant_id=235',
    status: 'available',
  },
  {
    giftId: 'faca-tramontina-century',
    name: 'Faca Tramontina Century',
    description:
      'Faca santoku de 7 polegadas para fatiar e picar, lâmina em aço inox e cabo de policarbonato. Amazon.',
    imageUrl: 'https://m.media-amazon.com/images/I/41j19wxPs+L._AC_SL1500_.jpg',
    price: 237.5,
    storeUrl:
      'https://www.amazon.com.br/Fatiar-Picar-Tramontina-Century-24020107/dp/B00KQVFAYO',
    status: 'available',
  },
  {
    giftId: 'jogo-facas-tramontina-plenus-6-pecas',
    name: 'Jogo de Facas Tramontina Plenus 6 Peças',
    description:
      'Jogo com 4 facas, tesoura e cepo de madeira, lâminas em aço inox e cabos pretos de polipropileno. Linha Plenus. Amazon.',
    imageUrl: '/gifts/jogo-facas-tramontina-plenus-6-pecas.png',
    price: 161.63,
    storeUrl: 'https://www.amazon.com.br/dp/B0772XQ7XQ',
    status: 'available',
  },
  {
    giftId: 'potes-hermeticos-fresh-lock',
    name: 'Kit de potes herméticos Fresh Lock',
    description:
      'Conjunto de potes de vidro borossilicato com trava hermética, linha Fresh Lock. Mercado Livre.',
    imageUrl:
      'https://http2.mlstatic.com/D_NQ_NP_788813-MLA95734885164_102025-OO.png',
    price: 195.9,
    storeUrl:
      'https://www.mercadolivre.com.br/kit-potes-hermetico-ou-de-vidro-linha-fresh-lock/p/MLB55818366',
    status: 'available',
  },
  {
    giftId: 'panela-pressao-vancouver',
    name: 'Panela de pressão Tramontina Vancouver',
    description:
      'Vancouver Effect de 6 L em alumínio com revestimento Starflon Max antiaderente, 24 cm, preta. Amazon.',
    imageUrl: 'https://m.media-amazon.com/images/I/71vhS1jZqnL._AC_SL1500_.jpg',
    price: 243.99,
    storeUrl:
      'https://www.amazon.com.br/Tramontina-Vancouver-Alum%C3%ADnio-Revestimento-Antiaderente/dp/B0CD4SFMD7',
    status: 'available',
  },
  {
    giftId: 'tabua-teak-grande',
    name: 'Tábua Teak Grande',
    description:
      'Tábua artesanal em madeira teca, 44 x 17 cm, com canaleta lateral para reter o caldo da carne. Projeto Recrie.',
    imageUrl:
      'https://www.projetorecrie.com.br/cdn/shop/files/Tabua_Teak_grande_sem_gravacao_grande.jpg',
    price: 108.5,
    storeUrl: 'https://www.projetorecrie.com.br/products/tabua-teak-grande',
    status: 'available',
  },
  {
    giftId: 'cutelo-tramontina-century',
    name: 'Cutelo Tramontina Century 7"',
    description:
      'Cutelo de 7 polegadas em aço inox NSF, cabo de polipropileno preto, para cortar carnes e cortes mais firmes. Amazon.',
    imageUrl: 'https://m.media-amazon.com/images/I/61ayC2xCp8L._AC_SL1500_.jpg',
    price: 194.23,
    storeUrl:
      'https://www.amazon.com.br/Cutelo-Tramontina-Century-24026107-Preto/dp/B01MUEETIQ',
    status: 'available',
  },
  {
    giftId: 'climatizador-wap-air-fresh-4-em-1',
    name: 'Climatizador de ar Wap Air Fresh 4 em 1',
    description:
      'Climatizador torre silencioso com reservatório de essência, 3 níveis de velocidade, 90 W, cor cinza, 220 V. Mercado Livre.',
    imageUrl: '/gifts/climatizador-wap-air-fresh-4-em-1.png',
    price: 399.0,
    storeUrl:
      'https://www.mercadolivre.com.br/climatizador-de-ar-wap-air-fresh-4-em-1-silencioso-com-reser/p/MLB62253167?product_trigger_id=MLB39766331&attributes=COLOR%3ACinza%2CVOLTAGE%3AMLB62253167&pdp_filters=item_id%3AMLB5251155650&applied_product_filters=MLB39766331&from=gshop&picker=true&quantity=1',
    status: 'available',
  },
  {
    giftId: 'garrafa-termica-home-style-mou',
    name: 'Garrafa Térmica Home Style Mou 960 ml',
    description:
      'Garrafa térmica para café de 960 ml com alça de madeira, mantém a temperatura por horas, linha Home Style. Camicado.',
    imageUrl: '/gifts/garrafa-termica-home-style-mou.png',
    price: 119.99,
    storeUrl:
      'https://www.camicado.com.br/p/garrafa-termica-home-style-mou/-/A-100834192-br.lc?sku=100834205',
    status: 'available',
  },
  {
    giftId: 'moedor-sal-pimenta-home-style-sofia',
    name: 'Moedor de Sal e Pimenta Home Style Sofia',
    description:
      'Moedor manual para sal grosso ou grãos de pimenta, mecanismo em cerâmica, linha Home Style Sofia. Camicado.',
    imageUrl: '/gifts/moedor-sal-pimenta-home-style-sofia.png',
    price: 99.99,
    storeUrl:
      'https://www.camicado.com.br/p/moedor-de-sal-e-pimenta-home-style-sofia/-/A-101143203-br.lc?sku=101143211',
    status: 'available',
  },
  {
    giftId: 'micro-ondas-brastemp-bms23ae',
    name: 'Micro-ondas Brastemp BMS23AE 23 L',
    description:
      'Micro-ondas de 23 L preto com multipreparos, receitas pré-programadas e função Auto Clean. Escolha 110 V ou 220 V na loja. Brastemp.',
    imageUrl: '/gifts/micro-ondas-brastemp-bms23ae.png',
    price: 587.0,
    storeUrl:
      'https://www.brastemp.com.br/micro-ondas-brastemp-23l-preto-com-multi-preparos---bms23ae/p',
    status: 'available',
  },
  {
    giftId: 'jogo-cama-percal-day-by-day-king',
    name: 'Jogo de Cama Percal 400 Fios Day by Day King — Wood Pearl',
    description:
      'Jogo de 4 peças em percal 400 fios com toque de pluma, tamanho King (lençol com elástico 193 x 203 cm, lençol sem elástico 250 x 280 cm e 2 fronhas). Cor Wood Pearl, linha Day by Day, Casa Di Valle. Renata Decorações.',
    imageUrl: '/gifts/jogo-cama-percal-day-by-day-king.png',
    price: 269.9,
    storeUrl:
      'https://www.renatadecoracoes.com/oferta-especial/jogo-de-cama-percal-400-fios-toque-de-pluma-4-pecas-day-by-day?variant_id=17782',
    status: 'available',
  },
  {
    giftId: 'jogo-cama-percal-day-by-day-king-branco',
    name: 'Jogo de Cama Percal 400 Fios Toque de Pluma 4 Peças — Day by Day King Branco',
    description:
      'Jogo de 4 peças em percal 400 fios com toque de pluma, tamanho King (lençol com elástico 193 x 203 cm, lençol sem elástico 250 x 280 cm e 2 fronhas). Cor Branco, linha Day by Day, Casa Di Valle. Renata Decorações.',
    imageUrl: '/gifts/jogo-cama-percal-day-by-day-king-branco.png',
    price: 269.9,
    storeUrl:
      'https://www.renatadecoracoes.com/oferta-especial/jogo-de-cama-percal-400-fios-toque-de-pluma-4-pecas-day-by-day?variant_id=17630',
    status: 'available',
  },
  {
    giftId: 'lencol-king-elastico-branco',
    name: 'Lençol Avulso King Com Elástico Percal 400 Fios — Branco',
    description:
      'Lençol avulso com elástico, tamanho King (193 x 203 x 40 cm), percal 400 fios toque de pluma, cor Branco, linha Day by Day. Renata Decorações.',
    imageUrl: '/gifts/lencol-king-elastico-branco.png',
    price: 139.9,
    storeUrl:
      'https://www.renatadecoracoes.com/cama/lencol-com-elastico/lencol-avulso-king-c-elastico-percal-400-fios-extra-macio?variant_id=3111',
    status: 'available',
  },
  {
    giftId: 'lencol-king-elastico-creme',
    name: 'Lençol Avulso King Com Elástico Percal 400 Fios — Creme',
    description:
      'Lençol avulso com elástico, tamanho King (193 x 203 x 40 cm), percal 400 fios toque de pluma, cor Creme, linha Day by Day. Renata Decorações.',
    imageUrl: '/gifts/lencol-king-elastico-creme.png',
    price: 139.9,
    storeUrl:
      'https://www.renatadecoracoes.com/cama/lencol-com-elastico/lencol-avulso-king-c-elastico-percal-400-fios-extra-macio?variant_id=3113',
    status: 'available',
  },
  {
    giftId: 'travesseiro-intense-vision-premium',
    name: 'Travesseiro Intense Vision Premium',
    description:
      'Travesseiro Buddemeyer Vision Premium Collection, 50 x 70 cm, extra macio, lavável na máquina. Precisamos de 2 unidades; cada convidado pode reservar 1. Camicado.',
    imageUrl: '/gifts/travesseiro-intense-vision-premium.png',
    price: 159.9,
    storeUrl:
      'https://www.camicado.com.br/p/travesseiro-intense-vision-premium/-/A-100787525-br.lc?sku=100787533',
    status: 'available',
    multiClaim: true,
    maxClaims: 2,
    claimCount: 0,
  },
  {
    giftId: 'micro-retifica-dremel-3000-n10',
    name: 'Micro-retífica Dremel 3000-N/10 90 W',
    description:
      'Micro-retífica de 90 W, 220 V, com estojo e 10 acessórios para corte, lixamento, polimento e gravação. Mercado Livre.',
    imageUrl: '/gifts/micro-retifica-dremel-3000-n10.png',
    price: 356.9,
    storeUrl:
      'https://www.mercadolivre.com.br/micro-retifica-dremel-3000-n10-90w-60hz/p/MLB15134255?product_trigger_id=MLB15053642&attributes=POWER%3A130+W%2CVOLTAGE%3A220V&picker=true&quantity=1',
    status: 'available',
  },
  {
    giftId: 'mesa-dobravel-luvinco-180m',
    name: 'Mesa Dobrável Luvinco 1,80 m',
    description:
      'Mesa dobrável que vira maleta, com alça portátil, 1,80 m x 70 cm x 74 cm, cor preta, estrutura em aço e tampo em polietileno, suporta até 150 kg. Mercado Livre.',
    imageUrl: '/gifts/mesa-dobravel-luvinco-180m.png',
    price: 284.9,
    storeUrl:
      'https://www.mercadolivre.com.br/mesa-dobravel-vira-maleta-com-alca-portatil-180m-para-camping-pesca-jardim-area-externa-ou-interna-salao-de-festas-gourmet-cor-preto-luvinco/p/MLB45353247',
    status: 'available',
  },
  {
    giftId: 'purificador-agua-consul-cpb34',
    name: 'Purificador de Água Consul — Natural e Gelada',
    description:
      'Purificador bivolt para mesa ou parede, com água natural e gelada, filtragem classe A, refil original Consul e alerta luminoso para troca. Magazine Luiza.',
    imageUrl: '/gifts/purificador-agua-consul-cpb34.png',
    price: 949.0,
    storeUrl:
      'https://www.magazineluiza.com.br/purificador-de-agua-natural-gelada-bivolt-mesa-parede-consul/p/hd7ag2ae66/ep/purf/',
    status: 'available',
  },
  {
    giftId: 'lavadora-alta-pressao-wap-wl-1800',
    name: 'Lavadora de Alta Pressão Compacta WAP WL 1800',
    description:
      'Lavadora compacta e portátil de 1400 W, 1500 PSI e vazão de 360 L/h, cor amarela, 220 V. Inclui pistola, mangueira de 3 m e bico regulável. Mercado Livre.',
    imageUrl: '/gifts/lavadora-alta-pressao-wap-wl-1800.png',
    price: 299.9,
    storeUrl:
      'https://www.mercadolivre.com.br/lavadora-de-alta-pressao-compacta-wap-wl-1800-1400w-1500psi-360lh-220v/p/MLB53860589',
    status: 'available',
  },
  {
    giftId: 'cesto-roupas-duplo-ou-flow-50l-bege',
    name: 'Cesto de Roupas Duplo OU Linha Flow 50 L — Bege',
    description:
      'Cesto com dois compartimentos ajustáveis e 50 L de capacidade, tampa basculante e abertura frontal, cor bege, linha Flow. Amazon.',
    imageUrl: '/gifts/cesto-roupas-duplo-ou-flow-50l-bege.png',
    price: 183.99,
    storeUrl: 'https://www.amazon.com.br/dp/B0GKPZWZVD',
    status: 'available',
  },
  {
    giftId: 'forno-embutir-brastemp-boa84ae',
    name: 'Forno de Embutir a Gás Brastemp BOA84AE 78 L',
    description:
      'Forno de embutir a gás de 78 L, preto, com grill e timer touch. Escolha 110 V ou 220 V na loja. Brastemp.',
    imageUrl: '/gifts/forno-embutir-brastemp-boa84ae.png',
    price: 1866.0,
    storeUrl: 'https://www.brastemp.com.br/forno-a-gas-de-embutir-brastemp-boa84ae/p',
    status: 'available',
  },
  {
    giftId: 'gift-card-zift-150',
    name: 'Gift Card Zift Multimarcas — R$ 150',
    description:
      'Cartão-presente multimarca Zift com crédito de R$ 150 para usar em mais de 40 marcas (Riachuelo, Airbnb, Tok&Stok, Centauro e outras). Americanas.',
    imageUrl: '/gifts/gift-card-zift-150.png',
    price: 150.0,
    storeUrl:
      'https://www.americanas.com.br/multibrand-zift-zilhoes-de-opcoes-8623937/p',
    status: 'available',
    multiClaim: true,
  },
  {
    giftId: 'mala-media-sestini-23kg',
    name: 'Mala Média 23kg de Viagem Sestini',
    description:
      'Mala média espaçosa em ABS, rodas 360º silenciosas, cadeado integrado personalizável e 76 L de capacidade (68 x 44 x 28 cm). Cor preta, linha Essencial 2. Amazon.',
    imageUrl: '/gifts/mala-media-sestini-23kg.png',
    price: 349.0,
    storeUrl: 'https://www.amazon.com.br/dp/B0H6F63J98',
    status: 'available',
  },
  {
    giftId: 'jogo-utensilios-tramontina-utility-5-pecas',
    name: 'Jogo Utensílios Tramontina Utility Inox 5 Peças',
    description:
      'Kit para servir em aço inox com acabamento brilho: colher para arroz, concha para feijão, garfo trinchante, pegador de massa e pá para bolo. Linha Utility. Mercado Livre.',
    imageUrl: '/gifts/jogo-utensilios-tramontina-utility-5-pecas.png',
    price: 129.0,
    storeUrl: 'https://www.mercadolivre.com.br/up/MLBU3152445397',
    status: 'available',
  },
]
