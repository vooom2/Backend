import { CloudUpload } from "lucide-react";


export default function DocumentUpload() {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 md:px-4 my-10">
            <div className="w-full max-w-3xl space-y-8">
                {/* Compulsory Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium  text-center">
                        Compulsory
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="mb-2">

                                <CloudUpload />
                            </div>
                            <p className="text-sm">Drivers license</p>
                        </div>
                    </div>
                </div>

                {/* Submit One Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium  text-center">
                        Submit one of these documents
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {/* NIN card/slip */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="mb-2">

                                    <CloudUpload />

                                </div>
                                <p className="text-sm ">NIN card/slip</p>
                            </div>
                        </div>

                        {/* Voters card */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="mb-2">
                                    <CloudUpload />

                                </div>
                                <p className="text-sm ">Voters card</p>
                            </div>
                        </div>

                        {/* International passport */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="mb-2">
                                    <CloudUpload />
                                </div>
                                <p className="text-sm ">International passport</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
