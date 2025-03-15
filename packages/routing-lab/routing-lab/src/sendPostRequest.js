export async function sendPostRequest(url, payload) {
   try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        // Handle error responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        // If the response is successful, return the parsed JSON (if available)
        try {
            return await response.json();
        } catch {
            return {}; // Return an empty object if there's no JSON body
        }
    } catch (error) {
        console.error("POST request failed:", error);
        throw error; // Re-throwing the error for the caller to handle
    }
}