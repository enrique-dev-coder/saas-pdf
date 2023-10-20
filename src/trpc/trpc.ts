import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
// RPC es como un framework pero para peticiones http como fetch y eso
// HTTP/REST
// const res = await fetch('/api/users/1');
// const user = await res.json();
// // RPC
// const user = await api.users.getById({ id: 1 });

const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // como hacer un middleware en expres se usa el next
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
// quiere decir que todos los private procedure usran el metodo de isAut como los middlewar en express
export const privateProcedure = t.procedure.use(isAuth);
