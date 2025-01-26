import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Header from "../Components/Header";
import AddResume from "../Components/AddResume";
import Card from "../Components/card";

const Dashboard = () => {
  const { user } = useUser(); // Fetch the user object from Clerk
  const userId = user?.id; // Extract the userId from the Clerk user object
  const [resumes, setResumes] = useState([]); // State to store fetched resumes

  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) {
        console.error("User ID is missing.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}`);
        if (response.status === 200) {
          setResumes(response.data); // Update state with fetched resumes
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchResumes();
  }, [userId]);

  return (
    <>
      <Header />
      <div className="md:px-20 lg:px-32">
        <h2 className="font-bold text-3xl">My Resume</h2>
        <p>Craft resumes that land your dream job!</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-5 ml-30 gap-4">
        <AddResume />
        {/* Render Card components for each resume */}
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <Card key={resume.resumeId} resumeId={resume.resumeId} title={resume.title} />
          ))
        ) : (
          <p></p> // Fallback if no resumes are fetched
        )}
      </div>
    </>
  );
};

export default Dashboard;
