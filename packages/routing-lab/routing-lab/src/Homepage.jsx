import { MainLayout } from "./MainLayout.jsx";

export function Homepage({username}) {
    return (
        <MainLayout>
            <h2>Welcome, {username}</h2>
            <p>This is the content of the home page.</p>
        </MainLayout>
    );
}
