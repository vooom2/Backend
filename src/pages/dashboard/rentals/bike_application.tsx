import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router"

export default function BikeApplication() {
  const payments = [
    { amount: 40000, duration: "2 weeks" },
    { amount: 20000, duration: "1 week" },
    { amount: 10000, duration: "2 weeks" },
  ]

  return (
    <div className="max-w-3xl mt-20 mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Application for bike</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1603039997315-6dcb72ec1204"
                alt="Qlink 2024"

                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">Qlink 2024</p>
              <p className="text-sm text-gray-500">VN 125893</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Avatar>
              <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="Dan Igwe" />
              <AvatarFallback>DI</AvatarFallback>
            </Avatar>
            <h2 className="text-sm mt-2 font-semibold">Dan Igwe</h2>
          </div>
        </div>

        <Select defaultValue="payment-0">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a payment option" />
          </SelectTrigger>
          <SelectContent>
            {payments.map((payment, index) => (
              <SelectItem key={index} value={`payment-${index}`}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      N{payment.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({payment.duration})
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              N{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </span>
          </div>
          <Link to="/dashboard/rent/available/apply/success">
            <Button className="w-full bg-black text-white hover:bg-gray-900" size="lg">
              Proceed
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

