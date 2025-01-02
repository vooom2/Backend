import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Manager {
    id: number
    name: string
    role: string
    avatar: string
    details: {
        phone: string
        email: string
        state: string
        lga: string
        location: string
    }
}

const managers: Manager[] = [
    {
        id: 1,
        name: "Elijah Haruna",
        role: "Wuse operational axis",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        details: {
            phone: "0903 456 8912",
            email: "Ejharuna234@gmail.com",
            state: "Federal Capital Territory",
            lga: "Abuja Municipal",
            location: "Wuse Operational Axis"
        }
    },
    {
        id: 2,
        name: "Layla Nguyen",
        role: "Garki operational axis",
        avatar: "https://randomuser.me/api/portraits/women/8.jpg",
        details: {
            phone: "0903 456 8912",
            email: "layla.nguyen@example.com",
            state: "Federal Capital Territory",
            lga: "Abuja Municipal",
            location: "Garki Operational Axis"
        }
    },
    {
        id: 3,
        name: "Gift Patel",
        role: "Lodge operational axis",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        details: {
            phone: "0903 456 8912",
            email: "noah.patel@example.com",
            state: "Federal Capital Territory",
            lga: "Abuja Municipal",
            location: "Lodge Operational Axis"
        }
    },
    {
        id: 4,
        name: "Ava Smith",
        role: "Maitama operational axis",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        details: {
            phone: "0903 456 8912",
            email: "ava.smith@example.com",
            state: "Federal Capital Territory",
            lga: "Abuja Municipal",
            location: "Maitama Operational Axis"
        }
    }
]

function DetailsField({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span>{value}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigator.clipboard.writeText(value)}
                >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy {label}</span>
                </Button>
            </div>
        </div>
    )
}

export default function FleetManager() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-semibold mb-6">Fleet Manager</h1>
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div className="space-y-2 bg-white rounded-xl p-6">
                    {managers.map((manager) => (
                        <div
                            key={manager.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <img
                                src={manager.avatar}
                                alt={manager.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                                <p className="font-medium">{manager.name}</p>
                                <p className="text-sm text-gray-500">{manager.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="p-6 border-0 shadow-none">
                    <h2 className="text-lg font-semibold mb-6">Details</h2>
                    <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <DetailsField label="Name" value={managers[0].name} />
                            <DetailsField label="Phone Number" value={managers[0].details.phone} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <DetailsField label="Email Address" value={managers[0].details.email} />
                            <DetailsField label="State" value={managers[0].details.state} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <DetailsField label="LGA" value={managers[0].details.lga} />
                            <DetailsField label="Location" value={managers[0].details.location} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

