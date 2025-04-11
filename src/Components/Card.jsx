import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ resumeId, title }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    console.log(`Resume ID: ${resumeId}`);
    navigate(`/dashboard/resume/${resumeId}/edit`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            className="p-14 py-24 border 
              items-center flex 
              justify-center bg-gray-100
              rounded-lg h-[280px] w-[240px]
              hover:scale-105 transition-all hover:shadow-md
              cursor-pointer border-dashed
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <p className="text-center font-bold text-gray-800">{title}</p>
          </button>
        </Dialog.Trigger>
      </Dialog.Root>
    </div>
  );
};

Card.propTypes = {
  resumeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  title: PropTypes.string.isRequired 
};

export default Card;