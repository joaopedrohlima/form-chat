import { ChatForm } from '@/components/ChatForm';

export default async function TripPage({ params }: { params: Promise<{ company: string, trip_id: string }> }) {
  const { company, trip_id } = await params;

  // Aqui você buscaria os detalhes da viagem para mostrar no topo do chat, se quisesse.
  // const viagem = await buscarViagem(trip_id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ChatForm company={company} tripId={trip_id} />
    </div>
  );
}
