'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MakePayment() {
    return (
        <div className="max-w-xl mt-8 mx-auto p-4">
            <Card className="p-6 space-y-6 bg-transparent border-0 shadow-none">
                <div>
                    <h1 className="text-xl font-semibold text-center">Payment Details</h1>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            defaultValue="Ceaser Pilate"
                            className="bg-gray-50"
                            disabled

                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            defaultValue="N1,000"
                            className="bg-gray-50"
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="week">Week</Label>
                        <Input
                            id="week"
                            defaultValue="Week 2"
                            className="bg-gray-50"
                            disabled
                        />
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-gray-900 py-3 rounded-full" size="lg">
                        Continue To Paystack
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                        Your personal data will be used to process your order, support your experience
                        throughout this website, and for other purposes described in our privacy policy.
                    </p>
                </div>
            </Card>
        </div>
    )
}

