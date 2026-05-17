export default function Ceremony() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-serif text-center mb-12">A cerimonia</h1>

      <div className="grid gap-12 md:grid-cols-2">
        <Card title="Quando" lines={['14 de Marco de 2027', 'Sabado, as 16h']} />
        <Card
          title="Onde"
          lines={['Capela de Sao Pedro', 'Rua das Flores, 123', 'Sao Paulo - SP']}
        />
        <Card
          title="Recepcao"
          lines={['Espaco Jardim', 'Rua das Flores, 200', 'A partir das 18h']}
        />
        <Card
          title="Trajes"
          lines={['Esporte fino', 'Cores claras sao bem-vindas']}
        />
      </div>

      <div className="mt-20 text-center">
        <p className="text-[var(--color-muted)]">
          Duvidas? Fale com a gente pelo WhatsApp:{' '}
          <a href="https://wa.me/5511999999999" className="underline">
            (11) 99999-9999
          </a>
        </p>
      </div>
    </section>
  )
}

function Card({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="border border-[var(--color-sand)] p-8 text-center">
      <h2 className="text-2xl font-serif mb-4">{title}</h2>
      {lines.map((l) => (
        <p key={l} className="text-[var(--color-muted)] leading-relaxed">
          {l}
        </p>
      ))}
    </div>
  )
}
