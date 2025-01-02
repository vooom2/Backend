import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CloudUpload } from "lucide-react";

export default function GuarantorForm() {
    return (
        <div className="flex items-center justify-center md:px-4 my-10">
            <div className="w-full max-w-3xl rounded-lg md:py-6 space-y-6">
                {/* Full name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <Input
                        type="text"
                        placeholder="Jane Doe"
                        className="mt-1 block w-full border rounded-md sm:text-sm px-3 py-2"
                    />
                </div>
                {/* Gender and Occupation */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <Select>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Male" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Occupation
                        </label>
                        <input
                            type="text"
                            placeholder="Rider"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                        />
                    </div>
                </div>
                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Phone number
                    </label>
                    <Input
                        type="text"
                        placeholder="+234 900 000 0000"
                        className="mt-1 block w-full border rounded-md sm:text-sm px-3 py-2"
                    />
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <Input
                        type="email"
                        placeholder="jane@email.com"
                        className="mt-1 block w-full border rounded-md sm:text-sm px-3 py-2"
                    />
                </div>
                {/* Org name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Organization name
                    </label>
                    <Input
                        type="text"
                        placeholder="org name"
                        className="mt-1 block w-full border rounded-md sm:text-sm px-3 py-2"
                    />
                </div>
                {/* Org name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Organization Location
                    </label>
                    <Input
                        type="text"
                        placeholder="Finance bridge"
                        className="mt-1 block w-full border rounded-md sm:text-sm px-3 py-2"
                    />
                </div>

                {/* Country and State */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <Select>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Nigeria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nigeria">Nigeria</SelectItem>
                                <SelectItem value="ghana">Ghana</SelectItem>
                                <SelectItem value="kenya">Kenya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <Select>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Abuja" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="abuja">Abuja</SelectItem>
                                <SelectItem value="lagos">Lagos</SelectItem>
                                <SelectItem value="enugu">Enugu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Home Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Home address
                    </label>
                    <Input
                        type="text"
                        placeholder="3, Wuse street, Abuja"
                        className="mt-1 block w-full sm:text-sm px-3 py-2"
                    />
                </div>

                {/* Work ID */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 flex items-center justify-center">
                    <div className="flex gap-2 items-center">
                        <CloudUpload />
                        <p className="text-sm ">Work ID Card</p>
                    </div>
                </div>
                {/* National ID */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 flex items-center justify-center">
                    <div className="flex gap-2 items-center">
                        <CloudUpload />
                        <p className="text-sm ">National ID</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
