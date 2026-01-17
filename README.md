# Magaiver Sales

SaaS completo para vender e operar a entrega de plataformas prontas, unindo **Landing Page + Checkout + Onboarding (briefing) + Dashboard operacional**.

A landing converte, o checkout confirma pagamento, o cliente preenche o briefing e o time operacional acompanha tudo em um painel, com **SLA de entrega de 7 dias**, status, fila de execução e automações de e-mail para evitar que o cliente trave o fluxo.

---

## Visão geral do produto

### Fluxo do cliente

- Navega na landing e entende a oferta por plano
- Escolhe o plano e finaliza compra (Stripe)
- Pode optar por pagamento presencial (fluxo registrado, sem cobrança online)
- Entra no onboarding/briefing para informar os dados necessários
- Recebe lembretes por e-mail caso não finalize o briefing

### Fluxo operacional (dashboard)

- Visão do dia: leads, pedidos, upsells, receita
- Acompanhamento de pedidos e status (ex: PENDING, PAID, REFUNDED)
- Acompanhamento do onboarding/briefing (ex: TODO, IN_PROGRESS, DONE)
- Controle do SLA de 7 dias para entrega
- Priorização do trabalho: pedido mais antigo, briefing pendente, upsell vendido, etc

### Automação e comunicação

- E-mails transacionais via Resend
- Lembrete automático para briefing não finalizado após a compra
- Notificações operacionais para reduzir retrabalho e acelerar entrega

---

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Prisma ORM
- PostgreSQL (Neon)
- Stripe (checkout + webhooks)
- Resend (e-mail)
- lucide-react (ícones)
- recharts (gráficos do dashboard)

---

## Requisitos

- Node.js 20+
- pnpm
- Conta no Neon (Postgres)
- Conta no Stripe
- Conta no Resend

---

## Rodar o projeto (rápido)

1. Instale as dependências

```bash
pnpm install
```

2. Crie o `.env` com as variáveis (modelo completo abaixo)

3. Rode migrations e seed

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

4. Suba o servidor

```bash
pnpm dev
```

Acesse:

- http://localhost:3000

---

## Setup do zero (comandos exatamente no padrão que você pediu)

> Rode tudo dentro da pasta onde você quer criar o projeto.

1. Criar o app Next

```bash
npx create-next-app@latest magaiver-sales
```

2. Entrar na pasta

```bash
cd magaiver-sales
```

3. Iniciar shadcn/ui

```bash
npx shadcn@latest init
```

4. Adicionar componentes shadcn/ui

```bash
npx shadcn@latest add button card badge separator accordion tabs input textarea dialog sheet sonner
```

5. Instalar utilitários de className

```bash
pnpm add clsx tailwind-merge
```

6. Ícones

```bash
pnpm add lucide-react
```

7. Tailwind PostCSS plugin

```bash
pnpm add -D @tailwindcss/postcss
```

8. Stripe

```bash
pnpm add stripe
pnpm add @stripe/stripe-js
```

9. Criar banco (exemplo Neon)

- Crie um projeto no Neon
- Copie a connection string do Postgres
- Cole no `.env` em `DATABASE_URL` (e opcionalmente `DIRECT_URL`)

10. Prisma

```bash
pnpm add prisma @prisma/client
```

11. Inicializar Prisma (se ainda não existir a pasta prisma/)

```bash
pnpm prisma init
```

12. Rodar migrations e seed (quando schema e seed já existirem)

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

---

## Scripts do projeto (package.json)

Este projeto usa estes scripts:

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "postinstall": "prisma generate",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint"
  },
  "prisma": {
    "seed": "node prisma/seed.cjs"
  }
}
```

Comandos úteis:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

---

## Variáveis de ambiente (.env)

Crie um arquivo `.env` na raiz do projeto. Exemplo completo:

```bash
# App
NODE_ENV=development
APP_URL=http://localhost:3000

# Database (Neon)
# Se o Neon te der duas URLs, use:
# DATABASE_URL: pooled (pooler), DIRECT_URL: direct (sem pooler) para migrations
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"

# Stripe
STRIPE_SECRET_KEY="sk_test_or_live_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_or_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Price IDs (exemplo do projeto)
STRIPE_PRICE_SAGE_BASE="price_xxx"
STRIPE_PRICE_SAGE_PAY="price_xxx"
STRIPE_PRICE_SAGE_AI="price_xxx"
STRIPE_PRICE_DEPLOY_HOSTING="price_xxx"

# Resend (emails)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="Magaiver Sales <no-reply@seu-dominio.com>"
EMAIL_REPLY_TO="suporte@seu-dominio.com"

# Segurança (se houver auth/token)
JWT_SECRET="coloque_uma_string_longa_e_aleatoria_aqui"
```

---

## Banco de dados (Neon + Prisma)

### 1) Criar banco no Neon

- Crie um projeto no Neon
- Pegue a connection string
- Cole no `.env` em `DATABASE_URL`
- Se possível, configure `DIRECT_URL` para migrations (Prisma)

### 2) Prisma: gerar client

O `postinstall` já roda `prisma generate` quando você instala dependências:

```bash
pnpm install
```

Se precisar rodar manual:

```bash
pnpm prisma generate
```

### 3) Migrations

```bash
pnpm prisma migrate dev
```

### 4) Seed

O projeto usa:

```json
{
  "prisma": {
    "seed": "node prisma/seed.cjs"
  }
}
```

Rodar seed:

```bash
pnpm prisma db seed
```

---

## Stripe (Checkout + Webhooks)

### 1) Criar produtos e preços

No painel do Stripe:

- Crie os produtos (planos)
- Crie os preços (Price IDs)
- Salve os `price_...` no `.env` (`STRIPE_PRICE_*`)

### 2) Webhooks no ambiente local (Stripe CLI)

Recomendado para testar o fluxo de compra com status real:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

O comando retorna um `whsec_...`:

- copie para `STRIPE_WEBHOOK_SECRET`

### 3) Por que webhook é obrigatório aqui

O status do pedido precisa refletir pagamento real (e não “achismo” do front).
O webhook confirma compra, atualiza pedido, inicia onboarding/briefing e libera automações (e-mail, SLA e dashboard).

---

## Resend (E-mails)

### 1) Configurar API Key

Crie a API key no Resend e coloque no `.env`:

```bash
RESEND_API_KEY="re_..."
```

### 2) Fluxos típicos de e-mail neste SaaS

- Confirmação de compra
- Lembrete: briefing não finalizado
- Lembrete de pendências dentro do prazo de entrega
- Mensagens para reduzir atrito e acelerar a entrega

---

## Deploy (Vercel)

Checklist objetivo:

1. Suba o projeto no GitHub
2. Importe na Vercel
3. Configure as Environment Variables na Vercel (as mesmas do `.env`)
4. Garanta que o build rode com:
   - `pnpm install`
   - `pnpm build`
5. Configure o Neon para aceitar conexões do ambiente de produção
6. Configure o webhook do Stripe apontando para a URL da Vercel:
   - `https://SEU_DOMINIO/api/webhooks/stripe`

Observação importante:

- Prisma não roda em Edge. Rotas que usam Prisma devem rodar em Node.
- Se houver route usando Prisma, mantenha runtime Node:

```ts
export const runtime = 'nodejs';
```

---

## Troubleshooting

### Prisma client não gerou

```bash
pnpm prisma generate
```

### Migration falha no Neon

- Use `DIRECT_URL` (conexão direta) para migrations
- Confirme `sslmode=require`

### Webhook Stripe não chega

- Local: use `stripe listen --forward-to ...`
- Produção: configure webhook no painel Stripe com a URL correta
- Confira `STRIPE_WEBHOOK_SECRET`

### E-mails não enviam

- Confira `RESEND_API_KEY`
- Confira `EMAIL_FROM` (domínio verificado ajuda muito)
- Verifique logs do servidor

---

## Dependências (referência do projeto)

Trecho do `package.json` (dependências e devDependencies):

```json
{
  "name": "magaiver-sales",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "postinstall": "prisma generate",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint"
  },
  "prisma": {
    "seed": "node prisma/seed.cjs"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@prisma/client": "^6.19.1",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@stripe/stripe-js": "^8.6.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "jose": "^6.1.3",
    "jwt": "^0.2.0",
    "lucide-react": "^0.561.0",
    "next": "16.0.10",
    "next-themes": "^0.4.6",
    "pg": "^8.16.3",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "react-hook-form": "^7.68.0",
    "recharts": "2.15.4",
    "resend": "^6.6.0",
    "sonner": "^2.0.7",
    "stripe": "^20.1.0",
    "tailwind-merge": "^3.4.0",
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/pg": "^8.16.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/ws": "^8.18.1",
    "dotenv": "^17.2.3",
    "eslint": "^9",
    "eslint-config-next": "16.0.10",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "prisma": "^6.19.1",
    "tailwindcss": "^4",
    "ts-node": "^10.9.2",
    "tsx": "^4.21.0",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
```

---

## Objetivo do projeto (sem enrolação)

Isso aqui é um funil que vira operação:

- Landing converte
- Checkout confirma pagamento
- Briefing coleta dados e evita retrabalho
- Dashboard operacional garante entrega previsível em 7 dias
- Resend reduz drop e puxa o cliente de volta quando ele trava

Se você configurar o `.env`, rodar migrations e seed, o projeto sobe local e fica pronto para evoluir o SaaS com consistência.
