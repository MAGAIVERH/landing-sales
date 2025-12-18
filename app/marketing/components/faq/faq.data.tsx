import type { FaqItem } from './faq.types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'i1',
    question: 'Em quanto tempo fica pronto?',
    answer: (
      <>
        Em média <span className='font-medium text-foreground'>3 a 7 dias</span>
        . O prazo varia conforme o segmento e o volume de ajustes (serviços,
        regras de agenda, textos e estrutura).
      </>
    ),
  },
  {
    id: 'i2',
    question: 'Qual a diferença entre Sage Base, Sage Pay e Sage AI?',
    answer: (
      <>
        <span className='font-medium text-foreground'>Sage Base</span>:
        agendamento completo (mobile-first) + regras de agenda + confirmação.
        <br />
        <span className='font-medium text-foreground'>Sage Pay</span>: tudo do
        Base + pagamento integrado (Stripe) para confirmar horário.
        <br />
        <span className='font-medium text-foreground'>Sage AI</span>: tudo do
        Pay + IA de atendimento para responder, qualificar e direcionar para
        agendar.
      </>
    ),
  },
  {
    id: 'i3',
    question: 'Hospedagem e domínio estão inclusos?',
    answer: (
      <>
        Você escolhe: hospedar com a gente (configuramos e colocamos no ar) ou
        hospedar por conta própria (a gente orienta e valida a implantação). Na
        proposta isso fica explícito e separado.
      </>
    ),
  },
  {
    id: 'i4',
    question: 'Vocês fazem implantação e configuração?',
    answer: (
      <>
        Sim. A implantação é guiada com checklist. Dependendo do plano e da
        opção de hospedagem, inclui SSL, domínio e validação final antes de
        publicar.
      </>
    ),
  },
  {
    id: 'i5',
    question: 'Posso começar no Sage Base e adicionar pagamento depois?',
    answer: (
      <>
        Sim. Você pode começar com o{' '}
        <span className='font-medium text-foreground'>Sage Base</span> e evoluir
        para o <span className='font-medium text-foreground'>Sage Pay</span>{' '}
        quando fizer sentido — sem refazer a plataforma do zero.
      </>
    ),
  },
  {
    id: 'i6',
    question: 'Pagamento obrigatório (Sage Pay) vale a pena?',
    answer: (
      <>
        Para serviços com agenda disputada, normalmente sim: reduz faltas, evita
        “horário furado” e deixa sua rotina e recebimento mais previsíveis.
      </>
    ),
  },
  {
    id: 'i7',
    question: 'O que é “manutenção” e como funciona a cobrança?',
    answer: (
      <>
        Manutenção é opcional e serve para ajustes contínuos (textos, pequenas
        melhorias de UX, otimizações de conversão e suporte recorrente). Sem
        manutenção, você pode solicitar ajustes avulsos quando precisar.
      </>
    ),
  },
  {
    id: 'i8',
    question: 'Tem suporte depois que publica?',
    answer: (
      <>
        Sim. Você tem suporte na implantação e orientação para operar a
        plataforma. Se optar por manutenção, você tem acompanhamento contínuo e
        ajustes com mais agilidade.
      </>
    ),
  },
];
