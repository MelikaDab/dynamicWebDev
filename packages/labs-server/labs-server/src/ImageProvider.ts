import { MongoClient, WithId } from "mongodb";
import { ImageDocument } from "interfaces";

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImages(): Promise<WithId<ImageDocument>[]> { // TODO #2
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<ImageDocument>(collectionName); // TODO #1
        return collection.find().toArray(); // Without any options, will by default get all documents in the collection as an array.
    }
}