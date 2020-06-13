import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { graphql } from "https://cdn.pika.dev/graphql@^15.0.0";
import schema from "./schema.ts";
import Query from "./resolver.ts";

const router = new Router();
const executeSchema = async ({ query }: any) => {
  const result = await graphql(schema, query, new Query());
  return result;
};

router.post("/graph", async ({ request, response }) => {
  if (request.hasBody) {
    // Proceed
    const body = await request.body();
    const result = await executeSchema(body.value);
    response.body = result;
  } else {
    response.body = "Query Not Available";
  }
});

let app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("app is running on PORT 5000");
app.listen({ port: 5000 });
