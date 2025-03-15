import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config(); 

class ImageFormatError extends Error {}
const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const fullPath = path.resolve(process.cwd(), uploadDir);

        // Ensure the directory exists
        if (!fs.existsSync(fullPath)) {
            console.log("making the folder")
            fs.mkdirSync(fullPath, { recursive: true }); // Creates the directory if missing
        }
        console.log(fullPath)
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        // determine the file extension
        let fileExtension = "";
        if (file.mimetype === "image/png") {
            fileExtension = "png";
        } else if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
            fileExtension = "jpg";
        } else {
            return cb(new ImageFormatError("Unsupported image type"), "");
        }

        // generate a unique filename
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;
        console.log(fileName)
        cb(null, fileName);
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}