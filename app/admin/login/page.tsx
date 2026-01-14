// 'use client';

// import { Lock, LogIn } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import * as React from 'react';

// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const sp = useSearchParams();
//   const nextPath = sp.get('next') ?? '/admin';

//   const [password, setPassword] = React.useState('');
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch('/api/admin/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ password }),
//       });

//       if (!res.ok) {
//         const data = (await res.json().catch(() => null)) as {
//           error?: string;
//         } | null;
//         throw new Error(data?.error ?? 'Falha ao entrar');
//       }

//       router.push(nextPath);
//       router.refresh();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Erro inesperado');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className='relative min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-white'>
//       <div className='pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl' />
//       <div className='pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl' />

//       <div className='mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-12'>
//         <Card className='w-full space-y-4 p-6'>
//           <div className='flex items-start gap-3'>
//             <span className='mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background'>
//               <Lock className='h-5 w-5' />
//             </span>
//             <div className='space-y-1'>
//               <p className='text-base font-semibold'>Admin</p>
//               <p className='text-sm text-muted-foreground'>
//                 Acesso restrito para acompanhar leads e vendas.
//               </p>
//             </div>
//           </div>

//           <form onSubmit={onSubmit} className='grid gap-3'>
//             <Input
//               type='password'
//               placeholder='Senha do admin'
//               className='h-11'
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             {error ? <p className='text-sm text-destructive'>{error}</p> : null}

//             <Button
//               type='submit'
//               className='h-11 w-full'
//               disabled={loading || !password.trim()}
//             >
//               <LogIn className='h-4 w-4' />
//               {loading ? 'Entrando...' : 'Entrar'}
//             </Button>
//           </form>
//         </Card>
//       </div>
//     </main>
//   );
// }

import { Suspense } from 'react';

import { AdminLoginClient } from './admin-login-client';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginClient />
    </Suspense>
  );
}
