import { UsernamePasswordForm } from "./UsernamePasswordForm"
import { sendPostRequest } from "../sendPostRequest"; 


export function RegisterPage() {
    async function handleRegister({ username, password }) {
        console.log("Registering user: ", username, password);
        try {
            // Send request to backend
            const responseData = await sendPostRequest("/auth/register", { username, password });

            // Return success message to form
            return { type: "success", message: "Registration successful!" };
        } catch (error) {
            // Return error message to form
            return { type: "error", message: error.message || "Registration failed." };
        }
    }

    return(
        <>
        <h1>Register a New Account</h1>
        <UsernamePasswordForm onSubmit={handleRegister}/> 
        </>
    )
}