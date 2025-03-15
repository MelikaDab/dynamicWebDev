import { useId } from 'react';
import { useState } from 'react';
import { useActionState } from "react";

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(file);
    });
}

export function ImageUploadForm({authToken}) {
    const id = useId();
    const [previewSrc, setPreviewSrc] = useState(null);
    
    async function handleFileChange(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            try {
                const dataURL = await readAsDataURL(file);
                setPreviewSrc(dataURL); // Update state with the preview image
            } catch (error) {
                console.error("Error reading file:", error);
            }
        }
    }

     const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const image = formData.get("image");
            const name = formData.get("name");

            if (!image || !name) {
                return {
                type: "error",
                message: `Please provide an image and a name`,
                };
            }
            // console.log("image and name")
            try {
                const response = await fetch("/api/images", {
                    method: "POST",
                    body: formData,
                    headers: {
                    "Authorization": `Bearer ${authToken}`, 
                }
                });
                if (!response.ok) {
                    // Handle HTTP 400 bad upload, HTTP 401 Unauthorized, etc...
                    let errorMessage = `Request failed with status ${response.status}`;

                    if (response.status === 401) {
                        errorMessage = "Incorrect username or password.";
                    } else if (response.status === 500) {
                        errorMessage = "Server error. Please try again later.";
                    } else {
                        // Try parsing JSON error message, if available
                        try {
                            const errorData = await response.json();
                            if (errorData.message) {
                                errorMessage = errorData.message;
                            }
                        } catch (jsonError) {
                            console.warn("Response is not valid JSON:", jsonError);
                        }
                    }

                    throw new Error(errorMessage);                      
                }
                 // If the response is successful, return the parsed JSON (if available)
                try {
                    return await response.json();
                } catch {
                    return {}; // Return an empty object if there's no JSON body
                }
            } catch (error) { // Network error
                console.error("POST request failed:", error);
                throw error; // Re-throwing the error for the caller to handle
            }
        },
        null
    );   
    return (
        <form action={submitAction}>
            <div>
                <label htmlFor={id}>Choose image to upload: </label>
                <input
                    name="image"
                    id={id}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <label>
                    <span>Image title: </span>
                    <input name="name"/>
                </label>
            </div>

            <div> {/* Preview img element */}
                <img style={{maxWidth: "20em"}} src={previewSrc} alt="image preview" />
            </div>

            <button type='submit'>Confirm upload</button>
            {result?.type === "error" && (
            <p style={{ color: "red", marginTop: "10px" }}>
                {result.message}
            </p>
            )}
        </form>
    );
}