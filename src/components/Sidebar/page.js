import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import imageLogo from "../../assets/Logos/logo1.png";
import cataloglogo from "../../assets/Logos/sidebarLogos/catalog.png"
import { getAllInvestments } from "../../network/Investments/page";
import { useInvestment } from "../../context/Investment/investmentContext";
const Sidebar = () => {

    const [path, setpath] = useState("")
    const location = useLocation();
    const currentUrl = location.pathname;
    const [investments, setInvestments] = useState(false)
    const { isInvestmentCreated, setIsInvestmentCreated } = useInvestment();

    useEffect(() => {
        const url = currentUrl;
        let capitalizedUrl = url.charAt(1).toUpperCase() + url.slice(2);
        setpath(capitalizedUrl);
    }, [location])


    useEffect(() => {
        onformSubmit()
    }, []);


    const onformSubmit = async () => {
        const resp = await getAllInvestments();
        if (resp.data.status === 201) {
            if (resp.data.data.data.length === 0) {
                setInvestments(false)
                setIsInvestmentCreated(false);
            }
            else {
                setInvestments(true)
                setIsInvestmentCreated(true);
            }
        }
    };

    return (
        <>
            <div>

                {/* <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span class="sr-only">Open sidebar</span>
                    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button> */}

                <aside id="border border-1 border-gray-50 separator-sidebar" class="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0 " aria-label="Sidebar">
                    <li className="bg-gradient-to-l from-[#020065] to-[#0400CB] ">
                        <img
                            className="h-auto w-full p-3 md:mt-0 sm:mt-20 mt-10 text-start"
                            src={imageLogo}
                            alt="Logo"
                        />
                    </li>
                    <div class="h-full border border-1 border-gray-100 px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 ">
                        <ul class="space-y-2 font-medium p-3">
                            {investments === true && (

                                <li className="mt-2">
                                    {currentUrl === "/dashboard" ? (

                                        <Link to="/dashboard" class=" text-start flex  items-start p-2 text-white p-4 rounded-lg  dark:text-white bg-gradient-to-l from-[#020065] to-[#0400CB]  group">
                                            <svg class="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                            </svg>
                                            <span class="flex-1 ms-3 whitespace-nowrap ">Dashboard</span>
                                        </Link>
                                    ) : (
                                        <Link to="/dashboard" class="text-start flex  items-start p-2 text-gray-900 p-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                            </svg>
                                            <span class="flex-1 ms-3 whitespace-nowrap ">Dashboard</span>
                                        </Link>
                                    )}
                                </li>

                            )}

                            {investments === true &&
                                (
                                    <li className="my-2">
                                        {currentUrl === "/payouts" ? (
                                            <Link
                                                to="/payouts"
                                                class="rounded-lg text-start flex items-start p-4 text-white  dark:text-white bg-gradient-to-l from-[#020065] to-[#0400CB] group"
                                            >
                                                <svg
                                                    class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 2a8 8 0 1 0 8 8 8.011 8.011 0 0 0-8-8Zm0 14a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6Zm-1-10h2a1 1 0 0 1 1 1v3h2v2h-2v1h-2v-1H7v-2h2V7Zm2 3V8h-2v2h2Z" />
                                                </svg>
                                                <span class="flex-1 ms-3 whitespace-nowrap">Payouts Tracker</span>
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/payouts"
                                                class="rounded-lg hover:text-black text-start flex items-center p-4 text-gray-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                            >
                                                <svg
                                                    class="text-start flex-shrink-0 w-6 h-6 text-gray-900 dark:text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 2a8 8 0 1 0 8 8 8.011 8.011 0 0 0-8-8Zm0 14a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6Zm-1-10h2a1 1 0 0 1 1 1v3h2v2h-2v1h-2v-1H7v-2h2V7Zm2 3V8h-2v2h2Z" />
                                                </svg>
                                                <span class="flex-1 ms-3 whitespace-nowrap">Payouts Tracker</span>
                                            </Link>
                                        )}
                                    </li>
                                )}

                            <li>

                                {currentUrl === "/catalogs" ? (
                                    <Link to="/catalogs" class="my-5 text-start flex  items-start p-2 text-white p-4 rounded-lg dark:text-white bg-gradient-to-l from-[#020065] to-[#0400CB] group">
                                        <svg
                                            class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-gray-400 "
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1ZM4 9a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H4Zm-1 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
                                        </svg>

                                        <span class="flex-1 ms-3 whitespace-nowrap ">Catalogs</span>
                                    </Link>
                                ) : (
                                    <Link to="/catalogs" class=" rounded-lg my-5 hover:text-black text-start flex items-center p-4 text-gray-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <svg
                                            class="text-start flex flex-shrink-0 w-6 h-6  items-start  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1ZM4 9a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H4Zm-1 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
                                        </svg>

                                        <span class="flex-1 ms-3 whitespace-nowrap">Catalogs</span>
                                    </Link>
                                )}
                            </li>


                            <li>
                                {currentUrl === "/notifications" ? (
                                    <Link
                                        to="/notifications"
                                        class=" rounded-lg text-start my-5 flex items-start p-4 text-white  dark:text-white bg-gradient-to-l from-[#020065] to-[#0400CB] group"
                                    >
                                        <svg
                                            class="flex-shrink-0 w-6 h-6 text-white transition duration-75 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 2a6 6 0 0 0-6 6v4.586l-.707.707A1 1 0 0 0 4 15h12a1 1 0 0 0 .707-1.707l-.707-.707V8a6 6 0 0 0-6-6Zm-2.293 14a2 2 0 1 0 4.586 0H7.707Z" />
                                        </svg>
                                        <span class="flex-1 ms-3 whitespace-nowrap">My Notifications</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/notifications"
                                        class="rounded-lg hover:text-black my-5 text-start flex items-center p-4 text-gray-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <svg
                                            class="text-start flex-shrink-0 w-6 h-6 text-gray-900 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 2a6 6 0 0 0-6 6v4.586l-.707.707A1 1 0 0 0 4 15h12a1 1 0 0 0 .707-1.707l-.707-.707V8a6 6 0 0 0-6-6Zm-2.293 14a2 2 0 1 0 4.586 0H7.707Z" />
                                        </svg>
                                        <span class="flex-1 ms-3 whitespace-nowrap">My Notifications</span>
                                    </Link>
                                )}
                            </li>
                            <li>
                                {currentUrl === "/profile-and-settings" ? (
                                    <Link
                                        to="/profile-and-settings"
                                        class="rounded-lg text-start flex items-start p-4 text-white  dark:text-white bg-gradient-to-l from-[#020065] to-[#0400CB] group"
                                    >
                                        <svg
                                            class="flex-shrink-0 w-5 h-5 my-1 text-white transition duration-75 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 0a5 5 0 1 1-5 5A5 5 0 0 1 10 0Zm0 11c-4.418 0-8 2.239-8 5v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.761-3.582-5-8-5Z" />
                                        </svg>
                                        <span class="flex-1 ms-3 whitespace-nowrap">Profile & Settings</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/profile-and-settings"
                                        class="rounded-lg hover:text-black text-start flex items-center p-4 text-gray-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <svg
                                            class="text-start flex-shrink-0 w-5 h-5 text-gray-900 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 0a5 5 0 1 1-5 5A5 5 0 0 1 10 0Zm0 11c-4.418 0-8 2.239-8 5v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.761-3.582-5-8-5Z" />
                                        </svg>
                                        <span class="flex-1 ms-3 whitespace-nowrap">Profile & Settings</span>
                                    </Link>
                                )}
                            </li>


                        </ul>
                    </div>
                </aside>

                {/* <div class="p-4 sm:ml-64 bg-white">
                    <div style={{ height: '1000px' }}></div>
                </div> */}

            </div>
        </>
    );
};

export default Sidebar;
