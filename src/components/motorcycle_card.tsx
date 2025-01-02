import { Heart } from 'lucide-react'
import { Motorcycle } from "../types/motorcycle";
import { useNavigate } from 'react-router';

export function MotorcycleCard({ model, year, condition, imageUrl, pricePerDay, maxDistance, rentalPeriod }: Motorcycle) {
    const navigate = useNavigate();
    return (
        <div className="border rounded-lg overflow-hidden bg-white" onClick={() => navigate("20")}>
            <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 rounded-md bg-white text-xs text-onprimary
                        ">
                        {condition}
                    </span>
                </div>

                <img
                    src={imageUrl}
                    alt={`${model} ${year}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                />
            </div>
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{`${model} ${year}`}</h3>
                    <div className="">
                        <button className="p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>{rentalPeriod}</span>
                    <span>{maxDistance}km max</span>
                </div>
                <div className="font-semibold text-right">N{pricePerDay.toLocaleString()}/day</div>
            </div>
        </div>
    )
}

