import { Suspense } from 'react';
import VerifyOtpPage from './VerifyOtp';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
