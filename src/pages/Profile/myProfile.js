import { useEffect, useState } from "react";
import { getCustomerById, updatecustomer } from "../../network/Customer/page";
import NavBar from "../../components/Navbar/page";
import WidgetButton from "../../widgets/Button/page";
import FormattedJsonViewer from "../../widgets/JsonView/page";

const Profile = () => {

    const [response, setResponse] = useState([]);
    const [customerDetails, setCustomerDetails] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        setCustomerDetails(customer);
    }, []);

    const onformSubmit = async () => {

        const payload = {
            name: "CUS 1 Updated ahsjd",
            nominee: {
                nominee_name: "venkanna Updated 2"
            }
        };

        const resp = await updatecustomer(payload, customerDetails._id);
        setResponse(resp.data.data);
    };

    const onformSubmit2 = async () => {
        const resp = await getCustomerById(customerDetails._id);
        setResponse(resp.data.data);
    };

    return (
        <>
            <NavBar />
            <div className="mt-10">
                <h1 className="text-3xl font-bold">Customer Details</h1> <br />
                <WidgetButton label="Update Customer" onClick={onformSubmit} />
                <WidgetButton label="Get Customer By Id" onClick={onformSubmit2} />
            </div>
            <div className="response-container mt-10 p-5 border border-gray-300 rounded-md bg-gray-100">
                <h3 className="text-lg font-bold mb-4">Response:</h3>
                <div className="p-4 rounded-md bg-white border border-gray-200">
                    {response && Object.keys(response).length > 0 ? (
                        <FormattedJsonViewer data={response} />
                    ) : (
                        <span>No response yet</span>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
