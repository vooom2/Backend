import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ProfileForm() {
    return (
        <div className="flex items-center justify-center md:px-4 my-10">
            <div className="w-full max-w-3xl rounded-lg md:py-6 space-y-6">
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

                {/* Upload Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload image (max 3mb)
                    </label>
                    <div className="flex items-center gap-4 mt-1">
                        <button
                            type="button"
                            className="bg-gray-100 border border-gray-300 text-gray-500 py-2 px-3 rounded-md text-sm"
                        >
                            Select a photo
                        </button>
                        <button
                            type="button"
                            className="bg-orange-500 text-white py-2 px-4 rounded-md text-sm hover:bg-orange"
                        >
                            Upload
                        </button>
                    </div>
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
            </div>
        </div>
    );
}
