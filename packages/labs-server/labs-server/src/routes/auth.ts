import { CredentialsProvider } from "../CredentialsProvider";
import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.

const signatureKey = process.env.JWT_SECRET
if (!signatureKey) {
    throw new Error("Missing JWT_SECRET from env file");
}

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end();
    } else { // signatureKey already declared as a module-level variable
        jwt.verify(token, signatureKey as string, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded; // modify response object with the decoded token
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

function generateAuthToken(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username: username },
            signatureKey as string,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    app.post("/auth/register", async (req: Request, res: Response) => {
        const credentialsProvider = new CredentialsProvider(mongoClient);
        const {username, password} = req.body;
        if (!username || !password) {
            res.status(400).send({
            error: "Bad request",
            message: "Missing username or password"
            });
        }

        try {
            const result = await credentialsProvider.registerUser(username, password);
            if (result === false) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Username already taken"
                });                    
            }
            const createdToken = await generateAuthToken(username);
            // console.log("created token: ",createdToken)
            res.status(201).send({ token: createdToken })
            

        } catch(error) {
            // console.log(error)
            res.status(500).json("Server error")
        }

        // credentialsProvider.registerUser(username, password)
        //     .then((result) => {
        //         if (result === false) {
        //             res.status(400).send({
        //                 error: "Bad request",
        //                 message: "Username already taken"
        //             });                    
        //         }
        //         const createdToken = await generateAuthToken(username);

        //         res.status(201).send({ token: createdToken })
        //     })
        //     .catch(error => res.status(500).json({ error: error.message }));
        // res.send("register request received")
    })


    app.post("/auth/login", async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const credentialsProvider = new CredentialsProvider(mongoClient);

        if (!username || !password) {
            res.status(400).send("Username and password are required");
        }
        const isValid = await credentialsProvider.verifyPassword(username, password);
        if (!isValid) {
            res.status(401).send("Incorrect username or password");
        }
        // Create a JWT token
        const createdToken = await generateAuthToken(username);

        res.send({ token: createdToken });

    })


}