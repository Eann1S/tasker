/* eslint-disable */

import { RedisContainer } from '@testcontainers/redis';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { spawn } from 'child_process';

var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const redisContainerStartup = async () => {
    console.log('\nStarting redis container...\n');
    const redisContainer = await new RedisContainer().start();
    process.env.REDIS_URL = redisContainer.getConnectionUrl();
    console.log('\nRedis container started\n');
    return redisContainer;
  };

  const dbContainerStartup = async () => {
    console.log('\nStarting database container...\n');
    const dbContainer = await new PostgreSqlContainer().start();
    process.env.DATABASE_URL = dbContainer.getConnectionUri();
    console.log('\nDatabase container started\n');
    return dbContainer;
  };

  const prismaInit = async () => {
    console.log('\nInitializing prisma\n');
    spawn('npx', ['prisma', 'migrate', 'deploy'], {
      shell: true,
      stdio: 'inherit',
    });
    console.log('\nPrisma initialized\n');
  };

  const serverStartup = () => {
    console.log('\nStarting server...\n');
    const server = spawn('nx', ['serve', 'tasker'], {
      shell: true,
      stdio: 'pipe',
    });
    console.log('\nServer started\n');

    server.stdout.on('data', (data) => {
      console.log(`Server Output: ${data}`);
    });

    server.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });
    return server;
  };

  const dbContainer = await dbContainerStartup();
  await prismaInit();
  const redisContainer = await redisContainerStartup();
  const server = serverStartup();

  globalThis.__SERVER_PROCESS__ = server;
  globalThis.__REDIS_CONTAINER__ = redisContainer;
  globalThis.__DB_CONTAINER__ = dbContainer;
  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';

  await new Promise((resolve) => setTimeout(resolve, 5000));
};
