import { Header } from "./Header.jsx";
import { Outlet } from "react-router"

export function MainLayout(props) {
    return (
        <div>
            <Header />
            <div style={{padding: "0 2em"}}>
                {/* {props.children} */}
                <Outlet />
            </div>
        </div>
    );
}
