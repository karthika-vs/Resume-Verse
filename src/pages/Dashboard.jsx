import React from "react";
import Header from "../Components/Header";
import AddResume from "../Components/AddResume";

const Dashboard = () => {
    return(
        <>
        <Header />;
        <div className='md:px-20 lg:px-32'>
            <h2 className='font-bold text-3xl'>My Resume</h2>
            <p>Craft resumes that land your dream job!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-5 ml-30">
        <AddResume />
        </div>
        </>
    )
}

export default Dashboard;