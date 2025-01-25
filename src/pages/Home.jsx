import React from "react";
import Header from "../Components/Header";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { isSignedIn } = useUser(); // Clerk's hook to check if the user is signed in
    const navigate = useNavigate(); // React Router's hook to navigate programmatically

    const handleGetStarted = () => {
        if (isSignedIn) {
            navigate("/dashboard"); // Redirect to the dashboard if signed in
        } else {
            navigate("/auth/sign-in"); // Redirect to the sign-in page if not signed in
        }
    };

    return (
        <>
            <Header />
            <main className="flex flex-col items-center text-center py-20 px-6">
                <h1 className="text-4xl md:text-7xl font-bold leading-tight mt-5 mb-4">
                    Build Your Resume
                </h1>
                <p className="text-2xl text-gray-500 mb-10">
                    Craft Your Future : Your Career, Your Story
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 mb-10"
                        onClick={handleGetStarted}
                    >
                        Get Started →
                    </button>
                </div>
                <div className="flex flex-wrap justify-center p-10 gap-6">
                    <div className="bg-red-200 p-8 rounded-lg w-64 text-center">
                        <p className="text-gray-600 text-xl text-bold mt-2">
                            Unlock a world of opportunities to shape your career journey
                        </p>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-lg w-64 text-center">
                        <p className="text-gray-600 text-xl text-bold justify-center text-center flex items-center mt-2">
                            Effortless Application Creation
                        </p>
                    </div>
                    <div className="bg-blue-200 p-6 rounded-lg w-64 text-center">
                        <p className="text-gray-600 text-xl text-bold mt-2">
                            Become the standout candidate to potential employers
                        </p>
                    </div>
                    <div className="bg-teal-200 p-6 rounded-lg w-64 text-center">
                        <p className="text-gray-600 text-xl text-bold mt-2">
                            Confidence strengthened by Personal Branding
                        </p>
                    </div>
                    <div className="bg-purple-200 p-6 rounded-lg w-64 text-center">
                        <p className="text-gray-600 text-xl text-bold text-center mt-2">
                            Streamlined application creation, freeing up more time for your
                            preparation
                        </p>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col md:flex-row items-start p-8 gap-40">
                        <div className="text-4xl md:text-7xl font-bold text-gray-900 leading-tight md:w-1/3">
                            Showcase
                            <br /> yourself
                        </div>
                        <div className="text-gray-600 text-xl md:w-2/3">
                            <p>
                                ResumeVerse is more than just a resume builder — it's a revolutionary
                                platform designed to elevate your job search experience. Our focus
                                is on empowering job seekers like you to present their full
                                potential and secure their dream roles, all while saving time and
                                enjoying the process as much as we've enjoyed creating it!
                            </p>
                            <p className="mt-4">
                                Design a seamless visual journey across your application and
                                visual appearance that reflects your unique identity, making each
                                aspect of your application uniquely yours. With ResumeVerse, you can
                                present yourself confidently and professionally, leaving a
                                memorable impression on potential employers. Start building your
                                distinctive brand today!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
