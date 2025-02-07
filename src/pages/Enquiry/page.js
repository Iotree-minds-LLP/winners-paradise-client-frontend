import { useEffect, useState } from "react";
import WidgetButton from "../../widgets/Button/page";
import FormattedJsonViewer from "../../widgets/JsonView/page";
import { createEnquiry } from "../../network/Enquiry/page";
import NavBar from "../../components/Navbar/page";
import moment from "moment";

const Enquiry = () => {
    const [response, setResponse] = useState([]);
    const [isError, setIsError] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([]);

    useEffect(() => {
        // Get customer details from local storage
        const data = localStorage.getItem("customerDetails");
        if (data) {
            const customer = JSON.parse(data);
            setCustomerDetails(customer);
        }
    }, []);

    const onformSubmit = async () => {
        const todayDate = moment().toDate(); // This gets the current local date and time

        const payload = {
            catalog_id: "673c7aa37a7da07f162f02af",
            investment_amount: 2000,
            starting_date: todayDate // Send a valid JavaScript Date object with today's date
        };

        try {
            const res = await createEnquiry(payload, customerDetails._id);
            if (res?.data?.status != 201) {
                setResponse(`Error: ${res.data.error}`);
                setIsError(true);
            } else {
                console.log(res, "res")
                setResponse(res.data.data.data);
                setIsError(false);
            }
        } catch (error) {
            setResponse(`Error: ${error.message}`);
            setIsError(true);
        }
    };

    return (
        <>
            <NavBar />
            <div className="mt-10">
                <h1 className="text-3xl font-bold">Create Enquiry</h1> <br />

                {/* Button to Create Enquiry */}
                <WidgetButton
                    label="Create Enquiry"
                    onClick={onformSubmit}
                />
            </div>

            {/* Response Container */}
            <div className="response-container mt-10 p-5 border border-gray-300 rounded-md bg-gray-100">
                <h3 className="text-lg font-bold mb-4">Response:</h3>
                <div className={`p-4 rounded-md bg-white border border-gray-200 ${isError ? "text-red-600" : ""}`}>
                    {response && Object.keys(response).length > 0 ? (
                        isError ? (
                            <span>{response}</span>
                        ) : (
                            <FormattedJsonViewer data={response} />
                        )
                    ) : (
                        <span>No response yet</span>
                    )}
                </div>
            </div>
        </>
    );
};

export default Enquiry;
