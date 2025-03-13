import { useImageFetching } from "./useImageFetching.js";
import { useParams } from "react-router";

export function ImageDetails() {

    const { imageId } = useParams();

    const { isLoading, fetchedImages } = useImageFetching(imageId, 500);
    if (isLoading) {
        return <h2>Loading...</h2>;
    }
    const imageData = fetchedImages.find((val) => val._id === imageId);
    if (!imageData) {
        console.log("image not found")
        return <h2>Image not found</h2>;
    }

    return (
        <>
            <h2>{imageData.name}</h2>
            <img className="ImageDetails-img" src={imageData.src} alt={imageData.name} />
        </>
    )
}
