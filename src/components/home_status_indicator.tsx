import { Clock, Bike } from 'lucide-react'
import { StatusIndicator } from "../types/motorcycle"

export function HomeStatusIndicatorCard({ label, value, icon, bg, }: StatusIndicator) {
    return (
        <div className={`p-4 py-5 rounded-2xl shadow-sm ${bg ?? "bg-white"}`}>
            <div className="flex justify-between items-start">
                <div className={`space-y-2 w-full ${bg ? "text-white" : "text-black"}`}>
                    <p className="text-sm text-gray-500">{label}</p>
                    <div className='flex items-center justify-between w-full'>
                        <p className="text-xl md:text-2xl font-semibold">{value}</p>
                        <div className={`p-4 rounded-lg ${icon === 'bike' ? 'bg-onprimary/10' : 'bg-onprimary/10'}`}>
                            {icon === 'clock' ? (
                                <Clock className="w-5 h-5 text-onprimary" />
                            ) : (
                                <Bike className="w-5 h-5 text-onprimary" />
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

