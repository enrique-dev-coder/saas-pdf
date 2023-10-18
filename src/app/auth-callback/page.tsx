'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/clients';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // el parametro de ?origin=
  // test
  const origin = searchParams.get('origins');
  //  const {data,isLoading} = trpc.test.useQuery()

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success)
        // user is synced to our db
        // la data base se va a creaer en prisma , una herrameinta para crear db dentro de la misma app de next
        // prisma sirve para interactuar con una db de forma mas sencilla
        // la db sera una mysqlcreada en un servicio que se llama planetscale
        router.push(origin ? `/${origin}` : '/dashboard');
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in');
      }
    },
    // el trcp se supone va a cehcar que tu usuario este validado algo asi como tener un cookie y checarlo cada que carges una pagina o algo asi
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up ypur account</h3>
        <p>You will be redirected autmomatically to your dashboard</p>
      </div>
    </div>
  );
};

export default Page;
