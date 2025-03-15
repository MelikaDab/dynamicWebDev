import { MainLayout } from "../MainLayout.jsx";
import { useImageFetching } from "./useImageFetching.js";
import "./ImageGallery.css";
import { Link } from "react-router";
import { ImageEditForm } from "./ImageEditForm.jsx";
import { ImageUploadForm } from "./ImageUploadForm.jsx";

export function ImageGallery(props) {
    // const { isLoading, fetchedImages } = useImageFetching("");

    const imageElements = props.fetchedImages.map((image) => (
        <div key={image._id} className="ImageGallery-photo-container">
            <Link to={"/images/" + image._id}>
                <img src={image.src} alt={image.name}/>
            </Link>
        </div>
    ));
    return (
        <>
            <h2>Image Gallery</h2>
            {props.isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>
            <ImageEditForm />
            <h3>Image Upload Form</h3>
            <ImageUploadForm />
        </>
    );
}
