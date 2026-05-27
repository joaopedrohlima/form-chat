import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-10">
      <h1 className="text-2xl font-bold">Escolha a hospedagem</h1>
      <div className="flex flex-col border border-muted rounded-lg shadow-md p-8 gap-4 w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-lg font-bold">Excursão Entre Irmãos</h2>
        <span>Acesse os principais formulários de reservas.</span>
        <Link href="/excursao-entre-irmaos" className="text-center bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">Acessar</Link>
      </div>
    </div>
  );
} 
