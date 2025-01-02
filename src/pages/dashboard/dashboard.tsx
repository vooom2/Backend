'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { HomeStatusIndicatorCard } from "@/components/home_status_indicator"

function CircularProgress() {
    return (
        <Card className="p-4 bg-[#1a1a1a] text-white">
            <div className="flex flex-col  items-center gap-4">
                <div className="relative h-40 w-40">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#444"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#ff6b00"
                            strokeWidth="3"
                            strokeDasharray="75, 100"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold">9 Days</span>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold">Inspection</p>
                    <p className="text-sm text-gray-400">of bike</p>
                </div>
            </div>
        </Card>
    )
}

export default function Dashboard() {
    const paymentData = [
        { week: 'Week 4 November', amount: 21500, outstanding: 0, delayedFine: 0, status: 'Make Payment' },
        { week: 'Week 4 October', amount: 21500, outstanding: 0, delayedFine: 0, status: 'Paid' },
        { week: 'Week 3 October', amount: 21500, outstanding: 3500, delayedFine: 0, status: 'Paid' },
        { week: 'Week 2 October', amount: 21500, outstanding: 0, delayedFine: 3500, status: 'Paid' },
        { week: 'Week 1 October', amount: 21500, outstanding: 0, delayedFine: 0, status: 'Paid' },
        { week: 'Week 4 September', amount: 21500, outstanding: 0, delayedFine: 0, status: 'Paid' },
        { week: 'Week 3 September', amount: 21500, outstanding: 3500, delayedFine: 0, status: 'Paid' },
        { week: 'Week 2 September', amount: 21500, outstanding: 0, delayedFine: 3500, status: 'Paid' },
        { week: 'Week 1 September', amount: 21500, outstanding: 0, delayedFine: 0, status: 'Paid' },
    ]

    return (
        <div className="container mx-auto p-2 lg:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1603039997315-6dcb72ec1204"
                            alt="Qlink 2024"

                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold">Qlink 2024</h2>
                            <Badge className="bg-green-100 text-green-700">
                                Active
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">VN 225893</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-col md:flex-row">
                    <Button variant="outline">View Detail</Button>
                    <Button variant="destructive">Make a report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <HomeStatusIndicatorCard label="Total Payment" icon="clock" value="N234,000" />
                <HomeStatusIndicatorCard label="Amount this week" icon="clock" value="N21,000" />
                <HomeStatusIndicatorCard label="Outstanding" icon="clock" value="N0" />
                <HomeStatusIndicatorCard label="Active Repairs" icon="bike" value="3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 text-nowrap">
                    <Card>
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Status of Payment</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Week</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Outstanding</TableHead>
                                    <TableHead>Delayed Fine</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.week}</TableCell>
                                        <TableCell>N{row.amount.toLocaleString()}</TableCell>
                                        <TableCell className={row.outstanding > 0 ? 'text-red-600' : ''}>
                                            {row.outstanding > 0 ? `N${row.outstanding.toLocaleString()}` : 'N0.00'}
                                        </TableCell>
                                        <TableCell className={row.delayedFine > 0 ? 'text-red-600' : ''}>
                                            {row.delayedFine > 0 ? `N${row.delayedFine.toLocaleString()}` : 'N0.00'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={row.status === 'Paid' ? 'secondary' : 'default'}
                                                className={row.status === 'Paid' ? 'bg-gray-100' : 'bg-black'}
                                            >
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
                <div>
                    <CircularProgress />
                </div>
            </div>
        </div>
    )
}

