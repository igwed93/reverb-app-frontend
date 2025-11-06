import { Suspense } from 'react';
import SocialAuthHandler from '@/components/SocialAuthHandler';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialAuthHandler />
    </Suspense>
  );
}
