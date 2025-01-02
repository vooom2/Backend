import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VehicleStatus {
    ticketNo: string
    dateReturned: string
    reason: string
    returnStatus: 'Ongoing' | 'Pending' | 'Resolved'
}

const reports: VehicleStatus[] = [
    {
        ticketNo: "#312567908",
        dateReturned: "04-03-2024 - 9:30am",
        reason: "Vehicle Accident",
        returnStatus: "Ongoing",
    },

]


function StatusBadge({ status }: { status: VehicleStatus['returnStatus'] }) {
    const styles = {
        Ongoing: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
        Pending: 'bg-red-100 text-red-700 hover:bg-red-100',
        Resolved: 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    }

    return (
        <Badge className={styles[status]} variant="secondary">
            {status}
        </Badge>
    )
}

export default function BikeHistory() {
    return (
        <div className="container mx-auto p-2 md:p-4 space-y-4 w-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Status of Vehicles</h1>
            </div>

            <div className="rounded-xl border overflow-hidden relative w-full text-nowrap">
                <Table>
                    <TableHeader className="bg-black hover:bg-black">
                        <TableRow>
                            <TableHead className="text-white">Vehicle No.</TableHead>
                            <TableHead className="text-white">Date Returned</TableHead>
                            <TableHead className="text-white">Reason for Return</TableHead>
                            <TableHead className="text-white">Status of Return</TableHead>
                            <TableHead className="text-white">View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <Avatar className="mr-2">
                                            <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 1}`} alt={`Avatar for ${report.ticketNo}`} />
                                            <AvatarFallback>{report.ticketNo.charAt(1)}</AvatarFallback>
                                        </Avatar>
                                        {report.ticketNo}
                                    </div>
                                </TableCell>
                                <TableCell>{report.dateReturned}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>
                                    <StatusBadge status={report.returnStatus} />
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-16">
                                                View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent >
                                            <DialogHeader>
                                                <DialogTitle>Details</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription>
                                                Duis tempor sit qui non ad laborum adipisicing. Esse velit quis incididunt consequat veniam labore tempor sint duis anim ex tempor sunt et. Do consectetur nostrud culpa qui minim quis duis dolor do dolore veniam ea aliquip laborum. Do culpa occaecat aliqua magna irure cupidatat esse anim dolor. Consectetur ea cillum fugiat magna dolor culpa ex quis deserunt. Nostrud do mollit eiusmod dolore aliquip Lorem eiusmod nisi nisi nostrud esse voluptate laborum. Cupidatat commodo occaecat nostrud occaecat excepteur pariatur dolore tempor amet.

                                            </DialogDescription>
                                            <DialogClose>
                                                <Button type="submit" className="w-full rounded-full">Close</Button>
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

