// esto es un componente solo para el navegador /cliente
'use client';
import React, { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/clients';
import { httpBatchLink } from '@trpc/client';

const Providers = ({ children }: PropsWithChildren) => {
  // esto es para usar react query
  const [queryClient] = useState(() => new QueryClient());
  // se crea una instancia de trpc en un folder _trpc ( para que el usuario no pueda navegar ahi)
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
