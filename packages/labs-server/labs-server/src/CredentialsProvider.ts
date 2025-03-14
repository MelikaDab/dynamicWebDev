import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { PassThrough } from "stream";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }


    async registerUser(username: string, plaintextPassword: string) {
        // Check if the user already exists
        const existingUser = await this.collection.findOne({ username });
        if (existingUser) {
            return false; // User already exists
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
        console.log("hashed pass: ", hashedPassword)
        // Store the username and hashed password in the database
        await this.collection.insertOne({
            username,
            password: hashedPassword, // Salt + Hash for storage
        });

        return true; // Successfully registered
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean> {
        // Find user in the database
        const user = await this.collection.findOne({ username });
        // console.log("user", user)
        // console.log("plaintext pass: ", plaintextPassword)
        if (!user) {
            return false; // User does not exist
        }

        // Compare the provided password with the stored hashed password
        const result =  await bcrypt.compare(plaintextPassword, user.password);
        // console.log("result: " , result)
        return result;
    }

}
