import Bottombar from "@/components/shared/Bottombar"
import LeftSidebar from "@/components/shared/LeftSidebar"
import Topbar from "@/components/shared/Topbar"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

function RootLayout() {
    return (
        <>
            <Topbar />
            <LeftSidebar />

            <main className="h-full w-full p-4 md:p-16">
                <Outlet />
            </main>

            <Toaster />

            <Bottombar />
        </>
    )
}

export default RootLayout