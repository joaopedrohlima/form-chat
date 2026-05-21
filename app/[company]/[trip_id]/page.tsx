import { ChatForm } from '@/components/ChatForm';
import { supabase } from '@/lib/supabase';

export default async function TripPage({ params }: { params: Promise<{ company: string, trip_id: string }> }) {
  const { company, trip_id } = await params;

  const { data: roteiro } = await supabase
    .from('roteiros')
    .select('*, locais (*)')
    .eq('id', trip_id)
    .single();

  const tripName = roteiro?.nome || undefined;
  const tripLocais = roteiro?.locais ? (roteiro.locais as any[]).map(l => l.nome).join(' + ') : undefined;

  return (
    <div className="h-dvh bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col">
      <ChatForm 
        company={company} 
        tripId={trip_id} 
        tripName={tripName}
        tripLocais={tripLocais}
      />
    </div>
  );
}
