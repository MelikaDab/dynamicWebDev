import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    app.get("/api/images", (req: Request, res: Response) => {
    let userId: string | undefined = undefined;
    if (typeof req.query.createdBy === "string") {
        userId = req.query.createdBy;
        // console.log("user id: ", userId)
    }       
    const imageProvider = new ImageProvider(mongoClient);
    imageProvider.getAllImagesWithAuthors(userId)
        .then(images => res.json(images))
        .catch(error => res.status(500).json({ error: error.message }));
    });

    app.patch("/api/images/:id", (req: Request, res: Response) => {
        const imageId = req.params.id;
        const {name}  = req.body;
        console.log("image id: ", imageId)
        console.log("name: ", name)

        res.send("OK")
    })


}