import { useId } from 'react';
import { useState } from 'react';

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(file);
    });
}

export function ImageUploadForm() {
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
    return (
        <form>
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
        </form>
    );
}