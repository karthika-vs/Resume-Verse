import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

const Card = ({ resumeId, title }) => {
  navigate = useNavigate();
  const handleCardClick = () => {
    console.log(`Resume ID: ${resumeId}`);
    navigate(`/dashboard/resume/${resumeId}/edit`);
  };

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <div
            onClick={handleCardClick} // Log resumeId on click
            className="p-14 py-24 border 
              items-center flex 
              justify-center bg-gray-100
              rounded-lg h-[280px] w-[240px]
              hover:scale-105 transition-all hover:shadow-md
              cursor-pointer border-dashed"
          >
            {/* Display the resume title dynamically with bold styling */}
            <p className="text-center font-bold text-gray-800">{title}</p>
          </div>
        </Dialog.Trigger>
      </Dialog.Root>
    </div>
  );
};

export default Card;
