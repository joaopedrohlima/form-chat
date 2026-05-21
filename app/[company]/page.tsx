import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatData } from '@/lib/formatters'

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  // TODO: Buscar dados da empresa pelo 'company' slug no banco de dados.
  const companyName = company === 'excursao-entre-irmaos' ? 'Excursão Entre Irmãos' : 'Empresa';

  const { data, error } = await supabase
    .from('roteiros')
    .select('*, locais (*)')
    .order('data_inicio', { ascending: true })
    .order('ordem', { referencedTable: 'locais', ascending: true });
  if (error) console.log(error);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">{companyName}</h1>
        <p className="text-muted-foreground">Escolha um dos nossos roteiros abaixo e garanta sua vaga!</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {data?.map((d, i) => (
          <div key={i} className="bg-background border border-muted rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="mb-2">{d.nome || 'Sem título'}</p>
            <h2 className="text-xl font-semibold mb-2">{d.locais.map((l: any) => l.nome).join(' + ') || 'Locais indefinidos'}</h2>
            <p className="text-sm text-muted-foreground mb-6">Data: {formatData(d.data_inicio) || 'Data indefinida'}</p>

            <Link
              href={`/${company}/${d.id}`}
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
