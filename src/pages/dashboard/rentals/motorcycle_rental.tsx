import { HomeStatusIndicatorCard } from "@/components/home_status_indicator";
import { MotorcycleCard } from "@/components/motorcycle_card";
import type { Motorcycle } from "@/types/motorcycle";


export default function MotorcycleRental() {
    const statusIndicators = [
        { label: "Total Payment", value: "No", icon: "clock" as const },
        { label: "Amount this week", value: "No", icon: "clock" as const },
        { label: "Outstanding", value: "No", icon: "clock" as const },
        { label: "Active Repairs", value: "0", icon: "bike" as const },
    ]

    const motorcycles: Motorcycle[] = Array(8).fill({
        id: "1",
        model: "Qlink",
        year: 2019,
        condition: "Brand new",
        imageUrl: "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
        pricePerDay: 28000,
        maxDistance: 20,
        rentalPeriod: "All day"
    })

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusIndicators.map((indicator, index) => (
                    <HomeStatusIndicatorCard key={index} {...indicator} />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {motorcycles.map((motorcycle, index) => (
                    <MotorcycleCard
                        key={index}
                        {...motorcycle}
                        condition={index % 2 === 0 ? "Brand new" : "Second Hand"}

                    />
                ))}
            </div>
        </div>
    )
}

