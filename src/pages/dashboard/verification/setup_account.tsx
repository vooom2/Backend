import { useState } from "react";
import Requirements from "./requirements";
import ProfileForm from "./profile_form";
import DocumentUpload from "./document_upload";
import GuarantorForm from "./guarantor_form";
import Verifying from "./verifying_account";
import { useNavigate } from "react-router";

export default function SetupAccount() {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    const handleStepChange = (index: number) => {
        if (index > 4) {
            navigate("/dashboard");
            return;
        }
        setCurrentStep(index);
    }

    return (
        <div className="mt-10 py-6 flex items-center justify-center ">
            <div className="max-w-4xl w-full">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-bold">Setup Account</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        We need to verify your identity and this requires that you upload
                        some documents for review.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-black py-3 px-4 sm:px-6 rounded-md justify-around">
                    <Step completed={currentStep > 0} label="Personal Verification" />
                    <Separator />
                    <Step completed={currentStep > 1} label="National Verification" />
                    <Separator />
                    <Step completed={currentStep > 2} label="Guarantors" />
                </div>

                {currentStep == 0 && <Requirements />}
                {currentStep == 1 && <ProfileForm />}
                {currentStep == 2 && <DocumentUpload />}
                {currentStep == 3 && <GuarantorForm />}
                {currentStep >= 4 && <Verifying />}

                {/* Next Button */}
                <div className="mt-6 text-center">
                    <button
                        className="max-w-3xl w-full mx-auto bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
                        onClick={() => handleStepChange(currentStep + 1)}
                    >
                        {currentStep <= 3 ? "Next" : "View Dashboard"}
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center mt-6 gap-3">
                    <span className={`w-10 h-1 ${currentStep >= 1 ? 'bg-black' : 'bg-gray-300'} rounded-full transition-all`}></span>
                    <span className={`w-10 h-1 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-300'} rounded-full transition-all`}></span>
                    <span className={`w-10 h-1 ${currentStep >= 3 ? 'bg-black' : 'bg-gray-300'} rounded-full transition-all`}></span>

                </div>
            </div >
        </div >
    );
}


interface StepProps {
    label: string;
    completed: boolean
}

function Step({ label, completed }: StepProps) {
    return (
        <div className="flex flex-col items-center space-y-1 text-gray-300 font-semibold">
            <div
                className={`h-5 w-5 flex items-center justify-center transition-all rounded-full ${completed ? 'bg-green-500' : 'bg-[#3C3E3C]'
                    }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-xs sm:text-sm text-center text-nowrap">{label}</span>
        </div>
    );
}

function Separator() {
    return <div className="hidden sm:block w-full h-[1px] bg-white/50 rounded" />;
}