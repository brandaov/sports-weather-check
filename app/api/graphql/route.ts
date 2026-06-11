import { createYoga } from "graphql-yoga";
import type { NextRequest } from "next/server";
import { schema } from "./schema";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

async function handle(request: NextRequest): Promise<Response> {
  return handleRequest(request, {});
}

export { handle as GET, handle as POST, handle as OPTIONS };
