import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { registerImageRoutes } from "./routes/images";
import cors from "cors";
import { registerAuthRoutes, verifyAuthToken } from "./routes/auth";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

let mongoClient: MongoClient; 

async function setUpServer() {

  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME, IMAGE_UPLOAD_DIR } = process.env;
  
  const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
  const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
  
  console.log("Attempting Mongo connection at " + connectionStringRedacted);
  
  mongoClient = await MongoClient.connect(connectionString);
  const collectionInfos = await mongoClient.db().listCollections().toArray();
  // console.log(collectionInfos.map(collectionInfo => collectionInfo.name)); // For debug only
  const app : Express = express();
  
  // middleware : code that runs before the handler functions
  app.use(express.static(staticDir));
  app.use("/uploads", express.static(IMAGE_UPLOAD_DIR || "uploads"))
  app.use(express.json());
  app.use(cors({
    origin: "http://localhost:5173", // Allow only your frontend origin
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type"], // Allow specific headers
}));

  app.get("/hello", (req: Request, res: Response) => {
      res.send("Hello, World");
  });

  registerAuthRoutes(app, mongoClient);

  app.use("/api/*", verifyAuthToken);
  registerImageRoutes(app, mongoClient);

  
  
  app.get("*", (req: Request, res: Response) => {
    console.log("none of the routes above me were matched");
    res.sendFile("index.html", { root: staticDir });
  });
  
  app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
  });


}

setUpServer();

