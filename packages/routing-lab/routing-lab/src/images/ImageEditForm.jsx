import { useState } from "react";

export function ImageEditForm() {
    const [imageId, setImageId] = useState("");
    const [imageName, setImageName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit() {
        setIsLoading(true);
        // Add your fetch code here...

        setImageId("");
        setImageName("");
        setIsLoading(false);
    }

    return (
        <div>
            <label style={{ display: "block" }}>
                Image ID
                <input
                        value={imageId}
                        disabled={isLoading}
                        onChange={(e) => setImageId(e.target.value)}
                />
            </label>
            <label style={{ display: "block" }}>
                New image name
                <input
                        value={imageName}
                        disabled={isLoading}
                        onChange={(e) => setImageName(e.target.value)}
                />
            </label>
            <button disabled={isLoading}>Send request</button>
        </div>
    );
}