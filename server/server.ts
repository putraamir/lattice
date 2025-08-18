import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { appRouter } from "./index";

const app = express();
const PORT = 3001;

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(PORT, () => {
  console.log(`tRPC server running on http://localhost:${PORT}`);
});
