import Link from 'next/link'

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  // TODO: Buscar dados da empresa pelo 'company' slug no banco de dados.
  const companyName = company === 'excursao-entre-irmaos' ? 'Excursão Entre Irmãos' : 'Empresa';

  // TODO: Buscar as viagens (roteiros) disponíveis para esta empresa no banco de dados.
  // Deixando espaço em branco para a sua implementação:
  // const viagens = await buscarViagensDaEmpresa(company);
  
  // Placeholder temporário para visualização:
  const viagens = [
    { id: '123', titulo: 'Viagem para Campos do Jordão', data: '15/10/2026', descricao: 'Passeio inesquecível pelas montanhas.' },
    { id: '456', titulo: 'Retiro Espiritual', data: '20/11/2026', descricao: 'Três dias de paz e comunhão.' }
  ];

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">{companyName}</h1>
        <p className="text-muted-foreground">Escolha um dos nossos roteiros abaixo e garanta sua vaga!</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {viagens.map((viagem) => (
          <div key={viagem.id} className="bg-background border border-muted rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{viagem.titulo}</h2>
            <p className="text-sm text-muted-foreground mb-4">Data: {viagem.data}</p>
            <p className="mb-6">{viagem.descricao}</p>
            
            <Link 
              href={`/${company}/${viagem.id}`}
              className="inline-block w-full text-center bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Preencher Formulário
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
