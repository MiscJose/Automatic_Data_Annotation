import Header from "./Header";
import { Outlet } from "react-router-dom";

function Layout(){
    return (
        <div className="p-2 flex flex-col">
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout