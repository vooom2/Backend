
function Requirements() {
    return (
        <div className="max-w-3xl mx-auto mt-10">
            {/* Requirements Section */}
            <div className="mt-6">
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
                    <li>Passport Photograph</li>
                    <li>Valid Government Issued ID</li>
                    <li>Core ID Card</li>
                    <li>Valid Utility Bill</li>
                </ul>
            </div>

            {/* Note Section */}
            <div className="mt-6 bg-gray-100 p-4">
                <h2 className="font-medium text-sm mb-2">Note:</h2>
                <p className="text-xs text-gray-600">
                    Uploaded documents must be in png, jpg, jpeg, or pdf formats.
                    Passport photographs must be against a plain background. Acceptable
                    IDs are Driver’s License, International Passport, National identity
                    card, or Voter’s card.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                    Please ensure all information submitted hereafter is valid and
                    adheres to the guidelines stated above to reduce the risk of your
                    verification request being rejected.
                </p>
            </div>
        </div>
    )
}

export default Requirements