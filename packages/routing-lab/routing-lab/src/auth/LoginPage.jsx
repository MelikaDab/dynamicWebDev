import { UsernamePasswordForm } from "./UsernamePasswordForm"
import { Link } from "react-router"


export function LoginPage() {
    return(
        <>
        <h1>Login</h1>
        <UsernamePasswordForm />
        <p>Don't have an account yet? <Link to={"/register"}>Register here</Link></p> 
        </>
    )
}