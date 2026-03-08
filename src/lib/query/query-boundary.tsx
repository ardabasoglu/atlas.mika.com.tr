"use client";

import { ReactNode } from "react";

interface QueryBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

export function QueryBoundary({
  children,
  loadingFallback = (
    <div className="flex items-center justify-center p-8">
      <span className="text-muted-foreground">Yükleniyor...</span>
    </div>
  ),
  errorFallback,
  isLoading,
  isError,
  error,
}: QueryBoundaryProps) {
  if (isLoading) return <>{loadingFallback}</>;
  if (isError && error) {
    return (
      <>
        {errorFallback ?? (
          <div className="flex items-center justify-center p-8 text-destructive">
            {error.message}
          </div>
        )}
      </>
    );
  }
  return <>{children}</>;
}
