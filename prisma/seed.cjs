require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mustGetEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

async function seed() {
  const items = [
    {
      slug: 'sage-base',
      name: 'Sage Base',
      description: 'Plataforma simples, rápida e pronta para agendar.',
      stripePriceId: mustGetEnv('STRIPE_PRICE_SAGE_BASE'),
      unitAmount: 99700,
    },
    {
      slug: 'sage-pay',
      name: 'Sage Pay',
      description:
        'Agendamento só com pagamento (menos risco, mais previsibilidade).',
      stripePriceId: mustGetEnv('STRIPE_PRICE_SAGE_PAY'),
      unitAmount: 149700,
    },
    {
      slug: 'sage-ai',
      name: 'Sage AI',
      description:
        'Pay + IA para atendimento (conversa, qualifica e direciona).',
      stripePriceId: mustGetEnv('STRIPE_PRICE_SAGE_AI'),
      unitAmount: 249700,
    },
    {
      slug: 'deploy-hosting-12m',
      name: 'Deploy + Hospedagem (12 meses)',
      description:
        'Setup + deploy + 12 meses de hospedagem incluídos (renovação fora do checkout).',
      stripePriceId: mustGetEnv('STRIPE_PRICE_DEPLOY_HOSTING'),
      unitAmount: 49700,
    },
  ];

  try {
    for (const item of items) {
      const product = await prisma.product.upsert({
        where: { slug: item.slug },
        update: {
          name: item.name,
          description: item.description,
          active: true,
        },
        create: {
          slug: item.slug,
          name: item.name,
          description: item.description,
          active: true,
        },
      });

      await prisma.price.upsert({
        where: { stripePriceId: item.stripePriceId },
        update: {
          productId: product.id,
          currency: 'brl',
          unitAmount: item.unitAmount,
          billingType: 'ONE_TIME',
          interval: null,
          active: true,
        },
        create: {
          productId: product.id,
          currency: 'brl',
          unitAmount: item.unitAmount,
          billingType: 'ONE_TIME',
          interval: null,
          stripePriceId: item.stripePriceId,
          active: true,
        },
      });
    }

    console.log('Seed completed.');
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
