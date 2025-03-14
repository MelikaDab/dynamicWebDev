import { CredentialsProvider } from "../CredentialsProvider";
import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    // app.get("/api/images", (req: Request, res: Response) => {
    // let userId: string | undefined = undefined;
    // if (typeof req.query.createdBy === "string") {
    //     userId = req.query.createdBy;
    //     // console.log("user id: ", userId)
    // }       
    // const imageProvider = new ImageProvider(mongoClient);
    // imageProvider.getAllImagesWithAuthors(userId)
    //     .then(images => res.json(images))
    //     .catch(error => res.status(500).json({ error: error.message }));
    // });
    // app.patch("/api/images/:id", (req: Request, res: Response) => {
    //     const imageId = req.params.id;
    //     const {name}  = req.body;
    //     console.log("image id: ", imageId)
    //     console.log("name: ", name)
    //     const imageProvider = new ImageProvider(mongoClient);
    //     imageProvider.updateImageName(imageId, name)
    //         .then((count) => {
    //             if (count === 0) { // if no matches found
    //                 res.status(404).send({
    //                     error: "Not found",
    //                     message: "Image does not exist"
    //                 });                
    //             }
    //             if (!name) { // if no name provided
    //                 res.status(400).send({
    //                     error: "Bad request",
    //                     message: "Missing name property"
    //                 });                    
    //             }
    //             res.status(204).send()
    //         })
    // })
    app.post("/auth/register", (req: Request, res: Response) => {
        const credentialsProvider = new CredentialsProvider(mongoClient);
        const {username, password} = req.body;
        if (!username || !password) {
            res.status(400).send({
            error: "Bad request",
            message: "Missing username or password"
            });
        }
        credentialsProvider.registerUser(username, password)
            .then((result) => {
                if (result === false) {
                    res.status(400).send({
                        error: "Bad request",
                        message: "Username already taken"
                    });                    
                }
                res.status(201).send()
            })
            .catch(error => res.status(500).json({ error: error.message }));
        // res.send("register request received")
    })


}