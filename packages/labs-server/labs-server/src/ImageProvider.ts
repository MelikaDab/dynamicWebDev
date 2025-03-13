import { Collection, MongoClient, WithId } from "mongodb";
import { ImageDocument, UserDocument } from "interfaces";

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImagesWithAuthors(author?: string): Promise<(WithId<ImageDocument> & { authorDetails: WithId<UserDocument> | null })[]> {
        const db = this.mongoClient.db();
        const imagesCollection: Collection<ImageDocument> = db.collection<ImageDocument>(process.env.IMAGES_COLLECTION_NAME!);
        const usersCollection: Collection<UserDocument> = db.collection<UserDocument>("users"); // Assuming "users" is the collection name

        const filter: { author?: string } = {};
        if (author) filter.author = author;  

        // Fetch all images
        const images = await imagesCollection.find(filter).toArray();

        // Extract unique author IDs
        const authorIds = [...new Set(images.map(img => img.author))];

        // Fetch users based on these author IDs
        const users = await usersCollection.find({ _id: { $in: authorIds } }).toArray();
        const userMap = new Map(users.map(user => [user._id, user]));

        // Merge user details into image objects
        return images.map(img => ({
          ...img,
          authorDetails: userMap.get(img.author) || null, // Attach full author data or null if not found
        }));
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        const db = this.mongoClient.db();
        const imagesCollection: Collection<ImageDocument> = db.collection<ImageDocument>(process.env.IMAGES_COLLECTION_NAME!);
        const {matchedCount} = await imagesCollection.updateOne({_id: imageId}, {$set:{name:newName}});
        return matchedCount;

    }

}