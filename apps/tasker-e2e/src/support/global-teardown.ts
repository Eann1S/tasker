/* eslint-disable */

import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StartedTestContainer } from "testcontainers";

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  const redisContainer: StartedTestContainer = globalThis.__REDIS_CONTAINER__;
  await redisContainer.stop();

  const dbContainer: StartedPostgreSqlContainer = globalThis.__DB_CONTAINER__;
  await dbContainer.stop();

  if (globalThis.__SERVER_PROCESS__) {
    globalThis.__SERVER_PROCESS__.kill();
  }
};
