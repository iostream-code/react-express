import { Outlet } from "react-router-dom"
import Navbar from "../../components/Navbar"

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="px-28 py-10">
                <Outlet />
            </main>
        </>
    )
}

export default MainLayout