'use client';

import React from 'react';
import { useProtectedRoute } from '@/hooks/use-protected';
import Loading from '@/components/custom/custom-loading';

export default function DashboardForm() {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return <Loading loading={true} />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
