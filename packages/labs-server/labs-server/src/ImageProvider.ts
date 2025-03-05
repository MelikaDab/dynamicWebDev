import { MongoClient, WithId } from "mongodb";
import { ImageDocument, ImageWithAuthor } from "interfaces";
import mongoose from "mongoose";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/your_database");

const ImageSchema = new mongoose.Schema({
  src: String,
  name: String,
  author: mongoose.Schema.Types.ObjectId, // Assume author is an ObjectId
  likes: Number,
});

// Define the Author schema
const AuthorSchema = new mongoose.Schema({
  name: String,
});

// Create Mongoose models
const Image = mongoose.model("Image", ImageSchema);
const Author = mongoose.model("Author", AuthorSchema);

async function denormalizeImages() {
  const images = await Image.aggregate([
    {
      $lookup: {
        from: "authors", // Collection to join
        localField: "author", // Field in `images`
        foreignField: "_id", // Field in `authors`
        as: "authorDetails",
      },
    },
    {
      $unwind: "$authorDetails", // Flatten the array created by $lookup
    },
    {
      $project: {
        _id: 1,
        src: 1,
        name: 1,
        likes: 1,
        author: {
          name: "$authorDetails.name",
          bio: "$authorDetails.bio",
          profilePic: "$authorDetails.profilePic",
        },
      },
    },
  ]);

  console.log(images);
}


export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImages(): Promise<ImageWithAuthor[]> { // TODO #2
        // const collectionName = process.env.IMAGES_COLLECTION_NAME;
        // if (!collectionName) {
        //     throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        // }

        // const collection = this.mongoClient.db().collection<ImageDocument>(collectionName); // TODO #1
        // return collection.find().toArray(); // Without any options, will by default get all documents in the collection as an array.

        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const authorsCollectionName = process.env.AUTHORS_COLLECTION_NAME;      

        if (!imagesCollectionName || !authorsCollectionName) {
            throw new Error("Missing required collection names from environment variables");
        }

        const collection = this.mongoClient.db().collection<ImageDocument>(imagesCollectionName);

        const images = await collection
            .aggregate<Document>([
                {
                    $lookup: {
                        from: authorsCollectionName, // Join with authors collection
                        localField: "author", // Field in images collection
                        foreignField: "_id", // Field in authors collection
                        as: "authorDetails",
                    },
                },
                {
                    $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true },
                },
                {
                    $project: {
                        _id: 1,
                        src: 1,
                        name: 1,
                        likes: 1,
                        author: {
                            name: "$authorDetails.name"
                        },
                    },
                },
            ])
            .toArray() as unknown as ImageWithAuthor[];

        return images;
    

    }
}