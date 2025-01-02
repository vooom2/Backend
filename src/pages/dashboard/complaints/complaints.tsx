import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from "react-router"

interface Report {
    ticketNo: string
    dateTime: string
    category: string
    status: 'Ongoing' | 'Pending' | 'Resolved'
    fleetManager: string
}

const reports: Report[] = [
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Vehicle Accident",
        status: "Ongoing",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Seized by V.I.O",
        status: "Pending",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Maintenance Delayed",
        status: "Resolved",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Vehicle Accident",
        status: "Ongoing",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Seized by V.I.O",
        status: "Pending",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Maintenance Delayed",
        status: "Resolved",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Vehicle Accident",
        status: "Ongoing",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Seized by V.I.O",
        status: "Pending",
        fleetManager: "Adams - 0904 567 1478"
    },
    {
        ticketNo: "#312567908",
        dateTime: "04-03-2024 - 9:30am",
        category: "Maintenance Delayed",
        status: "Resolved",
        fleetManager: "Adams - 0904 567 1478"
    }
]

const images = [
    "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
    "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
    "https://images.unsplash.com/photo-1603039997315-6dcb72ec1204",
]

function StatusBadge({ status }: { status: Report['status'] }) {
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

export default function Complaints() {
    return (
        <div className="container mx-auto px-2 md:px-4 py-8 w-screen relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Report</h1>

                <Link to="create">
                    <Button variant="destructive">Make a report</Button>
                </Link>
            </div>

            <div className="rounded-xl border overflow-hidden relative w-full">
                <div className="overflow-x-auto w-full">
                    <Table>
                        <TableHeader className="bg-black hover:bg-black">
                            <TableRow>
                                <TableHead className="text-white">Ticket No</TableHead>
                                <TableHead className="text-white">Date / Time</TableHead>
                                <TableHead className="text-white">Category</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white">Fleet Manager</TableHead>
                                <TableHead className="text-white">View</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report, index) => (
                                <TableRow key={index} className={`text-nowrap ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <TableCell className="font-medium">{report.ticketNo}</TableCell>
                                    <TableCell>{report.dateTime}</TableCell>
                                    <TableCell>{report.category}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={report.status} />
                                    </TableCell>
                                    <TableCell>{report.fleetManager}</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-16">
                                                    View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Electrical Failure</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    Duis tempor sit qui non ad laborum adipisicing. Esse velit quis incididunt consequat veniam labore tempor sint duis anim ex tempor sunt et. Do consectetur nostrud culpa qui minim quis duis dolor do dolore veniam ea aliquip laborum. Do culpa occaecat aliqua magna irure cupidatat esse anim dolor. Consectetur ea cillum fugiat magna dolor culpa ex quis deserunt. Nostrud do mollit eiusmod dolore aliquip Lorem eiusmod nisi nisi nostrud esse voluptate laborum. Cupidatat commodo occaecat nostrud occaecat excepteur pariatur dolore tempor amet.
                                                    <div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                            {images.map((src, index) => (
                                                                <img key={index} src={src} alt={`Image ${index + 1}`} className="w-full h-24 object-cover rounded-md shadow-md" />
                                                            ))}
                                                        </div>
                                                    </div>
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
        </div>
    )
}

