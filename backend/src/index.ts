import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/api/health', async () => ({ status: 'ok' }));

fastify.listen({ port: 3001 }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
