import { supabase } from "@/lib/supabase";

export type QuestionType = "text" | "date" | "select" | "number" | "tel";

export interface QuestionOption {
  value: string;
  label: string;
  n_max_parcelas?: number;
  valor_total?: number;
}

export interface Question {
  id: string; // Vai mapear para a coluna no banco de dados (ex: 'nome', 'cpf')
  text: string; // A pergunta que o bot fará
  type: QuestionType; // O tipo de input
  options?: QuestionOption[]; // Apenas para type === 'select'
  placeholder?: string;
}

// Para facilitar adicionar/remover, basta alterar este array.
// A ordem aqui dita a ordem das perguntas no chat.
export const formQuestions: Question[] = [
  {
    id: "nome",
    text: "Olá! Para começarmos a sua reserva, qual é o seu nome completo?",
    type: "text",
    placeholder: "Ex: João da Silva",
  },
  {
    id: "cpf",
    text: "Muito prazer! Qual é o seu CPF / RG?",
    type: "text",
    placeholder: "Apenas números, ex: 12345678900",
  },
  {
    id: "cpf_novo",
    text: "Qual é o tipo do seu CPF / RG?",
    type: "select",
    options: [
      {
        value: "true",
        label: "Novo",
      },
      {
        value: "false",
        label: "Antigo",
      },
    ],
  },
  {
    id: "data_nascimento",
    text: "Qual é a sua data de nascimento?",
    type: "date",
  },
  {
    id: "telefone",
    text: "Por favor, informe seu telefone com DDD (WhatsApp, de preferência):",
    type: "tel",
    placeholder: "Ex: 11999999999",
  },
  {
    id: "cidade",
    text: "De qual cidade você é?",
    type: "text",
    placeholder: "Ex: São Paulo - SP",
  },
  {
    id: "congregacao",
    text: "Qual a sua congregação?",
    type: "text",
    placeholder: "Ex: Congregação Central",
  },
  {
    id: "embarque",
    text: "Onde será o seu local de embarque?",
    type: "text",
    placeholder: "Ex: Rodoviária Novo Rio",
  },
  {
    id: "problema_saude",
    text: 'Você possui algum problema de saúde que precisemos saber? Se sim, qual? (Caso não, digite "Não")',
    type: "text",
    placeholder: 'Ex: Pressão alta, alergia, etc. ou "Não"',
  },
  {
    id: "n_parcelas",
    text: "Em quantas parcelas você deseja pagar?",
    type: "number",
    placeholder: "Ex: 1, 2, 3...",
  },
];
