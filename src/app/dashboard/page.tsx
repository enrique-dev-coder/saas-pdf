import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import Dashboard from '@/components/Dashboard';

const page = async () => {
  // get user token, kinde lo hace por ti en vez de hacer todo el hook tu solo
  // en un hook con ctrl + spc puedes ver lo que se destrucutra
  const { getUser } = getKindeServerSession();

  const user = getUser();
  console.log(user);
  // obvio estos usuarios se tienen que verificar que esten en la base de datos de la app
  // si entra a la ruta y no esta logeado algo ais como el use navigate de react
  // en esa pagina tambien se registra al usuario en la db
  if (!user || !user?.id) redirect('/auth-callback?origin=dashboard');

  // nos aseguramos que el usuario este registrado
  const dbuser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  if (!dbuser) redirect('/auth-callback?origin=dashboard');

  return <Dashboard />;
};

export default page;
