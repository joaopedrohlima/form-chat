"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formQuestions, Question } from "@/config/questions";
import { ChatBubble } from "./ChatBubble";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
}

export function ChatForm({
  company,
  tripId,
  tripName,
  tripLocais,
}: {
  company: string;
  tripId: string;
  tripName?: string;
  tripLocais?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = formQuestions[currentQuestionIndex];

  // Iniciar o chat
  useEffect(() => {
    if (messages.length === 0 && formQuestions.length > 0) {
      setMessages([
        {
          id: `bot-q-${0}`,
          text: formQuestions[0].text,
          isBot: true,
        },
      ]);
    }
  }, [messages.length]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReviewing, isSuccess]);

  const handleSend = (selectedValue?: string) => {
    const valueToSave = selectedValue ?? inputValue.trim();
    if (!valueToSave && currentQuestion.type !== 'select') return;
    if (!valueToSave) return;

    // 1. Adicionar resposta do usuário
    const userMsg: ChatMessage = {
      id: `user-a-${currentQuestionIndex}`,
      text: currentQuestion.type === 'select'
        ? currentQuestion.options?.find(o => o.value === valueToSave)?.label || valueToSave
        : valueToSave,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: valueToSave }));
    setInputValue("");

    // 2. Próxima pergunta ou Revisão
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < formQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-q-${nextIndex}`,
            text: formQuestions[nextIndex].text,
            isBot: true,
          },
        ]);
      }, 600); // delay simula o bot digitando
    } else {
      setTimeout(() => {
        setIsReviewing(true);
      }, 800);
    }
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);

    try {
      // O Supabase gera o ID automaticamente se estiver configurado assim na tabela.
      const payload = {
        roteiro_id: tripId,
        cpf: answers.cpf ? answers.cpf.replace(/\D/g, '') : '',
        data_nascimento: answers.data_nascimento,
        telefone: answers.telefone ? answers.telefone.replace(/\D/g, '') : '',
        n_parcelas: parseInt(answers.n_parcelas) || 1,
        embarque: answers.embarque,
        problema_saude: answers.problema_saude,
        cidade: answers.cidade,
        congregacao: answers.congregacao,
        metodo_pagamento: answers.metodo_pagamento,
        nome: answers.nome,
      };

      const { error } = await supabase
        .from('reservas')
        .insert([payload]);

      if (error) throw error;

      setIsSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
      alert("Ocorreu um erro ao enviar sua reserva. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Reserva Concluída!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Seus dados foram enviados com sucesso. Entraremos em contato em breve com mais detalhes sobre a viagem.
          </p>
          <Link
            href={`/${company}`}
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para as viagens
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full md:max-w-none mx-auto bg-white dark:bg-slate-950 shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 md:px-8 lg:px-16 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Link href={`/${company}`} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Logo Placeholder */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 select-none flex-shrink-0 overflow-hidden">
            <Image src="/logo-excursao-entre-irmaos.jpg" alt="Logo" width={50} height={50} className="object-cover" />
          </div>

          <div>
            <h1 className="font-semibold text-base md:text-lg leading-tight">
              {tripName || "Assistente de Reserva"}
            </h1>
            <p className="text-primary-foreground/80 text-xs md:text-sm mt-0.5 line-clamp-1">
              {tripLocais || "Preencha seus dados para garantir a vaga"}
            </p>
          </div>
        </div>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-16 no-scrollbar bg-slate-50 dark:bg-slate-900">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg.text} isBot={msg.isBot} />
          ))}
        </AnimatePresence>

        {/* Resumo/Revisão */}
        {isReviewing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mt-6 shadow-sm mb-4 max-w-2xl md:mx-auto w-full"
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Confira seus dados:</h3>
            <div className="space-y-3 mb-6">
              {formQuestions.map((q) => (
                <div key={q.id} className="border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0">
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{q.text}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {q.type === 'select'
                      ? q.options?.find(o => o.value === answers[q.id])?.label
                      : answers[q.id]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm mb-4 text-slate-600 dark:text-slate-400">Tudo certo com as informações?</p>
            <button
              onClick={handleSubmitFinal}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Sim, confirmar reserva!"
              )}
            </button>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Input */}
      {!isReviewing && currentQuestion && (
        <div className="p-4 md:px-8 lg:px-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            {currentQuestion.type === 'select' ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl md:mx-auto w-full">
                {currentQuestion.options?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setInputValue(opt.value);
                      handleSend(opt.value);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl text-left transition-colors font-medium border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex flex-1 items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1 focus-within:ring-2 focus-within:ring-primary/50 transition-all border border-transparent focus-within:border-primary/50 max-w-2xl md:mx-auto w-full"
              >
                <input
                  type={currentQuestion.type}
                  placeholder={currentQuestion.placeholder || "Digite sua resposta..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent border-none py-3 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-primary text-white p-2 rounded-full disabled:opacity-50 hover:bg-primary/90 transition-colors ml-2 flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
