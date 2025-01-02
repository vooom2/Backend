import { Bell, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import MobileNav from './mobile_nav'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
function DashboardHeader() {
    return (
        <header className="sticky top-0 bg-background z-10 py-6 px-0 md:px-4">
            <div className="flex h-16 items-center px-4 gap-4 ">
                {/* Mobile Navigation */}
                <MobileNav />

                {/* Main Content */}
                <div className="flex-1 flex sm:flex-row sm:items-center sm:justify-between gap-2 ">
                    {/* Left Section: Title and Welcome Text */}
                    <div className="flex flex-col gap-1 flex-1">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Hi 👋, welcome to your dashboard
                        </p>
                    </div>

                    {/* Right Section: Search, Notification, and Buttons */}
                    <div className="flex items-center gap-4 flex-none md:flex-1 justify-end">
                        {/* Search Input */}
                        <div className="relative w-full hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search Notification..."
                                className="h-10 px-4 py-2 rounded-lg border text-sm bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full"
                            />
                        </div>

                        <div className="relative">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div>

                                        <Bell />
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                            2
                                        </span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">

                                </PopoverContent>
                            </Popover>

                        </div>

                        {/* Contact Fleet Manager Button */}
                        <Button
                            size="sm"
                            className="bg-onprimary hover:bg-onprimary/90 text-white whitespace-nowrap hidden md:block"
                        >
                            Contact Fleet Manager
                        </Button>

                        {/* Profile/Menu Icon */}
                        <div className="items-center gap-2 border rounded-md px-2 py-1 hidden md:block">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div >
        </header >

    )
}

export default DashboardHeader