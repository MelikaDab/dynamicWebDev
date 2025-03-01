import { MainLayout } from "../MainLayout.jsx";
import { useImageFetching } from "./useImageFetching.js";
import "./ImageGallery.css";
import { Link } from "react-router";

export function ImageGallery() {
    const { isLoading, fetchedImages } = useImageFetching("");

    const imageElements = fetchedImages.map((image) => (
        <div key={image.id} className="ImageGallery-photo-container">
            <Link to={"/images/" + image.id}>
                <img src={image.src} alt={image.name}/>
            </Link>
        </div>
    ));
    return (
        <MainLayout>
            <h2>Image Gallery</h2>
            {isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>
        </MainLayout>
    );
}
