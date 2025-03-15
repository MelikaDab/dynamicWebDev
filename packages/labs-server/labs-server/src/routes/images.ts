import express, { Request, RequestHandler, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";
import { handleImageFileErrors, imageMiddlewareFactory } from "../imageUploadMiddleware";

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
        const imageProvider = new ImageProvider(mongoClient);
        imageProvider.updateImageName(imageId, name)
            .then((count) => {
                if (count === 0) { // if no matches found
                    res.status(404).send({
                        error: "Not found",
                        message: "Image does not exist"
                    });                
                }
                if (!name) { // if no name provided
                    res.status(400).send({
                        error: "Bad request",
                        message: "Missing name property"
                    });                    
                }
                res.status(204).send()
            })
    })


// app.post(
//     "/api/images",
//     imageMiddlewareFactory.single("image"), // Multer middleware
//     handleImageFileErrors, // Error-handling middleware
//     async (req: Request, res: Response, next: NextFunction) => { 
//         try {
//             // Ensure both file and name exist
//             if (!req.file || !req.body.name) {
//                 return res.status(400).json({
//                     error: "Bad Request",
//                     message: "Both image file and name are required.",
//                 });
//             }

//             // Extract user info from res.locals.token
//             console.log(res.locals.token); // Check structure in logs
//             const author = res.locals.token?.username ?? "Unknown"; 

//             // Construct image document
//             const newImage = {
//                 _id: req.file.filename, 
//                 src: `../uploads/${req.file.filename}`,
//                 name: req.body.name,
//                 likes: 0,
//                 author,
//             };

//             // Insert into database
//             const imageProvider = new ImageProvider(mongoClient);
//             await imageProvider.createImage(newImage);

//             // Respond with created document
//             return res.status(201).json(newImage);
//         } catch (error) {
//             console.error("Error saving image metadata:", error);
//             next(error); // Pass error to Express error handler
//         }
//     }
// );

const uploadImageHandler: RequestHandler = async (req, res, next) => {
    try {
        // Ensure both file and name exist
        if (!req.file || !req.body.name) {
            res.status(400).json({
                error: "Bad Request",
                message: "Both image file and name are required.",
            });
            return; // Ensure function stops here
        }

        // Extract user info from res.locals.token
        console.log(res.locals.token);
        const author = res.locals.token?.username ?? "Unknown";

        // Construct image document
        const newImage = {
            _id: req.file.filename,
            src: `../uploads/${req.file.filename}`,
            name: req.body.name,
            likes: 0,
            author,
        };

        // Insert into database
        const imageProvider = new ImageProvider(mongoClient);
        await imageProvider.createImage(newImage);

        // Respond with created document (do not use return)
        res.status(201).json(newImage);
    } catch (error) {
        console.error("Error saving image metadata:", error);
        next(error); // Properly pass error to Express
    }
};

app.post(
    "/api/images",
    imageMiddlewareFactory.single("image"),
    handleImageFileErrors,
    uploadImageHandler // Now using correctly typed handler
);
}