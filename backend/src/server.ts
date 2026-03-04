import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import parser from "cookie-parser";
import routes from "./routes";
import morgan from "morgan";
import connectDB from "./config/db.config";
import { logger } from "./libraries/logger";
import { join } from "path";

const app = express();
const PORT = process.env.PORT || 8000;

/* -------------------------------------------------------------------------- */
/*                            APP-LEVEL MIDDLEWARES                           */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(parser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------------------- */
/*                                 API ROUTES                                 */
/* -------------------------------------------------------------------------- */
app.use("/api", routes);

if (process.env.NODE_ENV === "development") {
  app.use("/uploads", express.static(join(process.cwd(), "uploads")));
}

/* -------------------------------------------------------------------------- */
/*                              FRONTEND ROUTING                              */
/* -------------------------------------------------------------------------- */
if (process.env.NODE_ENV === "production") {
  const frontendDir = join(__dirname, "..", "..", "frontend", "dist");
  app.use(express.static(frontendDir));

  // send index.html
  app.use((req, res, next) => {
    return !req.path.includes("/api")
      ? res.sendFile(join(frontendDir, "index.html"))
      : next();
  });
}

/* -------------------------------------------------------------------------- */
/*                            GROUND LEVEL HANDLER                            */
/* -------------------------------------------------------------------------- */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `404: Cannot ${req.method} ${req.url}`,
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  if (status === 500) {
    logger.error(`Error at ${req.url} - ground level handler`);
    console.log(err.stack);
  } else {
    logger.error(`${err.message} - at ${req.url}`);
  }

  res.status(status).json({
    success: false,
    status,
    message: err.message,
  });
});

/* -------------------------------------------------------------------------- */
/*                                   SERVER                                   */
/* -------------------------------------------------------------------------- */
Promise.all([connectDB()])
  .then(() => {
    app.listen(PORT, () => {
      logger.success(`Server listening on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    logger.error("Failed to start server. Initiating clean exit");
    console.log(err.stack);
    process.exit(1);
  });

/* -------------------------------------------------------------------------- */
/*                                 SAFETY SAKE                                */
/* -------------------------------------------------------------------------- */
process.on("uncaughtException", async (err, origin) => {
  logger.error("Uncaught exception detected: Initiating clean exit");
  console.log(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", async (err: Error) => {
  logger.error("Unhandled rejection detected: Initiating clean exit");
  console.log(err.stack);
  process.exit(1);
});
