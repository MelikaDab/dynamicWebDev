import { MainLayout } from "./MainLayout.jsx";

export function Homepage({username}) {
    return (
        <>
            <h2>Welcome, {username}</h2>
            <p>This is the content of the home page.</p>
        </>
    );
}
