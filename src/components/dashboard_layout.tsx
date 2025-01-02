
import Sidebar from './sidebar'
import { Outlet } from 'react-router'
import DashboardHeader from './dashboard_header'
export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#F9F9F9] w-screen">
            <div className="flex">
                <div className="hidden md:block w-64 fixed inset-y-0">
                    <Sidebar />
                </div>
                <main className="flex-1 md:pl-64 ">
                    <DashboardHeader />
                    <div className="px-2 md:p-4 space-y-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

