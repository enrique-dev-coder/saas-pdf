import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';
// aqui se crean las rutas como los endpoints en un back normal para hacer el objeto de RPC
export const appRouter = router({
  // test: publicProcedure.query(() => {
  //   // sintaxis de nextjs
  //   //  return new Response("hola")
  //   // sintaxis de trpc
  //   return 'hello';
  // }),

  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user?.id || !user?.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user?.id,
      },
    });

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user?.id,
          email: user?.email,
        },
      });
    }

    return { success: true };
  }),
  // procedimiento al que solo pueden llamar los qu eesten auth
  // el ctx es el que ya s ele puso al middleware en el archivo trpc.ts
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    // query para obtener files
    // esto quiere decir buscar los files que concuerden con el userId de nuestro contexto
    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  // el req.body = input
  // en mutation va la logica de lo que le pasara al input
  deleteFile: privateProcedure
    .input(
      // esta libreria es para tipar las req.boy
      z.object({ id: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      // buscar el file con el id del file y que haga match con el del usuario
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });
      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });
      // despues de pasar los chequeos se borra
      await db.file.delete({
        where: {
          id: input.id,
        },
      });
      return file;
    }),
});

export type AppRouter = typeof appRouter;
