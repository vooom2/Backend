'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Link } from "react-router"

export default function MotorcycleRentalDetails() {
    const images = [
        "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
        "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
        "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
        "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
        "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
    ]

    const features = [
        { label: "Type", value: "Delivery" },
        { label: "Status of Bike", value: "Brand New" },
        { label: "Colour", value: "Black" },
        { label: "Gear transmission", value: "Automatic" },
        { label: "Bluetooth", value: "Yes" },
        { label: "Android Auto", value: "Yes" },
        { label: "Rear Camera", value: "Yes" },
        { label: "GPS", value: "Yes" },
        { label: "USB Input", value: "No" },
        { label: "AUX Input", value: "No" },
        { label: "Any fault", value: "No" },
        { label: "Duration", value: "2 years" },
    ]

    const documents = [
        "VIN registration",
        "ANPR registration",
        "Biker registration",
        "Insurance",
        "Bike Receipt",
    ]

    return (
        <div className="max-w-6xl mx-auto p-4  space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Link to="/dashboard/rent/available/apply/id">
                        <Button className="w-full  bg-black text-white hover:bg-gray-900" size="lg">
                            Apply for Bike
                        </Button>
                    </Link>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                            src={images[0]}
                            alt="Motorcycle main view"
                            className="object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {images.slice(1).map((src, i) => (
                            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                                <img
                                    src={src}
                                    alt={`Motorcycle view ${i + 2}`}
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-full mt-4">
                            <div className="flex justify-between w-full">
                                <h1 className="text-2xl font-bold">Qlink 2024</h1>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Active
                                </Badge>
                            </div>
                            <div className="flex gap-6 justify-between text-sm text-gray-500 mt-4">
                                <p className="space-y-2 text-center">Reg number
                                    <span className="block font-bold text-bold text-black text-sm">VN 125893</span>
                                </p>
                                <p className="space-y-2 text-center">Rider number
                                    <span className="block font-bold text-bold text-black text-sm">AB.R0372DF</span>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-gray-100">
                        <h2 className="text-lg font-semibold mb-4">Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10">
                            {features.map((feature, i) => (
                                <div key={i}>
                                    <p className="text-sm text-gray-500">{feature.label}</p>
                                    <p className="font-medium">{feature.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10">
                            <h2 className="text-lg font-semibold mb-4">Health Status</h2>
                            <div className="flex flex-wrap gap-10">

                                <div >
                                    <p className="text-sm text-gray-500">Body and Exterior</p>
                                    <p className="font-medium">No damage</p>
                                </div>
                                <div >
                                    <p className="text-sm text-gray-500">Engine</p>
                                    <p className="font-medium">Optimal Performance</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {documents.map((doc, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-lg">
                            <FileText className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-xs text-center">
                            {doc}
                            <br />
                            <span className="text-red-600">Available</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

