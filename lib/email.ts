import { Resend } from 'resend';

type SendAccessLinkEmailParams = {
  to: string;
  accessUrl: string;
  expiresInDays: number;
};

export const sendAccessLinkEmail = async ({
  to,
  accessUrl,
  expiresInDays,
}: SendAccessLinkEmailParams) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) throw new Error('Missing RESEND_API_KEY');
  if (!from) throw new Error('Missing EMAIL_FROM');

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to,
    subject: 'Seu link de acesso para revisar o briefing',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 12px;">Acesse seu pedido</h2>
  
        <p style="margin: 0 0 16px;">
          Use o botão abaixo para revisar e atualizar o seu briefing quando quiser.
        </p>
  
        <p style="margin: 0 0 18px;">
          <a href="${accessUrl}"
             style="display:inline-block;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;">
            Abrir meu acesso
          </a>
        </p>
  
        <p style="margin: 0 0 6px; font-size: 12px; color: #555;">
          Este link expira em ${expiresInDays} dia(s).
        </p>
  
        <p style="margin: 0; font-size: 12px; color: #777;">
          Se você não solicitou isso, pode ignorar este e-mail com segurança.
        </p>
      </div>
    `,
  });
};
