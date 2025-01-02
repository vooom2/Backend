import { APP_NAME } from "@/utils/constant";
import { FileWarning, X } from 'lucide-react';
import { Button } from "./ui/button";
import { Link } from "react-router";

export default function VerificationBanner() {
    return (
        <div className="px-4 py-6 sm:py-8">
            <div className="relative flex flex-col p-4 sm:p-6 bg-black text-white rounded-lg shadow-lg max-w-4xl mx-auto">
                <button
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
                <p className="text-sm text-gray-200">Hi, Lorem Ipsum</p>
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mt-1 pr-8">
                    Finish your account setup (0/3){" "}
                    <span aria-hidden="true" className="ml-2">→</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Complete your KYC and Identity Verification to enable you to become
                    verified on Vooom
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white py-4 px-4 sm:px-6 rounded-xl">
                    <Step label="Personal Verification" />
                    <Separator />
                    <Step label="National Verification" />
                    <Separator />
                    <Step label="Guarantors" />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <div className="rounded-full bg-blue-100 p-3 sm:p-4 mb-4 w-fit">
                    <FileWarning className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-blue-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-3">You have no active Bike on {APP_NAME}</h3>
                <Link to="/dashboard/setupaccount">
                    <Button className="rounded-3xl bg-black px-4 py-2 text-sm sm:text-base">Complete Verification</Button>
                </Link>
            </div>
        </div>
    );
}

interface StepProps {
    label: string;
}

function Step({ label }: StepProps) {
    return (
        <div className="flex items-center space-x-2 text-black">
            <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full border bg-black">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2 w-2 sm:h-3 sm:w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-xs sm:text-sm">{label}</span>
        </div>
    );
}

function Separator() {
    return <div className="w-full h-[1px] sm:w-6 sm:h-[2px] bg-black rounded my-2 sm:my-0" />;
}

