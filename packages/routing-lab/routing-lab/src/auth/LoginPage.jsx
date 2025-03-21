import { UsernamePasswordForm } from "./UsernamePasswordForm"
import { sendPostRequest } from "../sendPostRequest";
import { Link, useNavigate } from "react-router"


export function LoginPage({setToken}) {
    const navigate = useNavigate();

    async function handleLogin({ username, password }) {
        console.log("Logging in user: ", username, password);
        try {
            // Send request to backend
            const responseData = await sendPostRequest("/auth/login", { username, password });

            console.log(responseData.token) // token
            setToken(responseData.token);
            navigate('/')

        } catch (error) {

            return { type: "error", message: error.message || "Login failed." };
        }
    }    
    return(
        <>
        <h1>Login</h1>
        <UsernamePasswordForm onSubmit={handleLogin}/>
        <p>Don't have an account yet? <Link to={"/register"}>Register here</Link></p> 
        </>
    )
}