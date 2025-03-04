import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

let mongoClient: MongoClient; 

async function setUpServer() {

  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
  
  const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
  const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
  
  console.log("Attempting Mongo connection at " + connectionStringRedacted);
  
  mongoClient = await MongoClient.connect(connectionString);
  const collectionInfos = await mongoClient.db().listCollections().toArray();
  // console.log(collectionInfos.map(collectionInfo => collectionInfo.name)); // For debug only
}

const app : Express = express();
app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/images", (req: Request, res: Response) => {})

app.get("/api/images", (req: Request, res: Response) => {
  // if (!mongoClient) {
  //   return res.status(500).send("Database not initialized");
  // }

  const imageProvider = new ImageProvider(mongoClient);
  imageProvider.getAllImages()
    .then(images => res.json(images))
    .catch(error => res.status(500).json({ error: error.message }));
});


app.get("*", (req: Request, res: Response) => {
  console.log("none of the routes above me were matched");
  res.sendFile("index.html", { root: staticDir });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

setUpServer();