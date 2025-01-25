import React from "react";

const PersonalDetails = ({ resumeInfo }) => {
  if (!resumeInfo) return null;

  const { firstName, lastName, address, phoneNo, email, linkedin } = resumeInfo;

  return (
    <div className="text-center font-serif">
      {/* Name */}
      <h1 className="text-3xl font-bold tracking-wider">
        {`${firstName} ${lastName}`}
      </h1>

      {/* Contact Info */}
      <div className="text-base">
        <p className="">
          {address} · {email} · {phoneNo}
        </p>
        <p>
          {linkedin}
        </p>
      </div>
    </div>
  );
};

export default PersonalDetails;
