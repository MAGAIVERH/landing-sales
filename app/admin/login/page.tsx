import { Suspense } from 'react';

import { AdminLoginClient } from './admin-login-client';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginClient />
    </Suspense>
  );
}
