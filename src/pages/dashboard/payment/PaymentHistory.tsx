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
import { Link } from "react-router"


export default function PaymentHistory() {
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


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <HomeStatusIndicatorCard bg="bg-black" label="Total Payment" icon="clock" value="N234,000" />
                <HomeStatusIndicatorCard label="Amount this week" icon="clock" value="N21,000" />
                <HomeStatusIndicatorCard label="Outstanding" icon="clock" value="N0" />
                <HomeStatusIndicatorCard label="Active Repairs" icon="bike" value="3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-4">
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
                                            <Link to={row.status != "Paid" ? "/dashboard/payments/pay" : ""}>
                                                <Badge
                                                    variant={row.status === 'Paid' ? 'secondary' : 'default'}
                                                    className={row.status === 'Paid' ? 'bg-gray-100' : 'bg-black'}
                                                >
                                                    {row.status}
                                                </Badge>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

            </div>
        </div>
    )
}

