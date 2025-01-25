import React, { useState } from "react";
import { PlusSquare } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid"; // Import UUID
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddResume = () => {
  const [title, setTitle] = useState("");
  const { user } = useUser();
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <div
            className="p-14 py-24 border 
              items-center flex 
              justify-center bg-gray-100
              rounded-lg h-[280px] w-[240px]
              hover:scale-105 transition-all hover:shadow-md
              cursor-pointer border-dashed"
          >
            <PlusSquare className="text-gray-600" size={48} />
          </div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2 
              bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <Dialog.Title className="text-xl font-semibold mb-2">
              Create New Resume
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-4">
              Add a title for your new resume
            </Dialog.Description>
            <input
              type="text"
              placeholder="Ex. Full Stack Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-200 rounded-md">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className={`px-4 py-2 rounded-md text-white ${
                    title.trim()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (title.trim()) {
                      const data = {
                        resumeId: uuidv4(), // Generate unique ID
                        userId: user?.id,
                        userEmail: user?.emailAddresses[0]?.emailAddress,
                        userName: user?.fullName,
                        title,
                      };
                      console.log("New Resume Created:", data);

                      // Navigate to the edit page with the generated resumeId
                      navigate(`/dashboard/resume/${data.resumeId}/edit`);
                    }
                  }}
                  disabled={!title.trim()} // Button is disabled if title is empty
                >
                  Create
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AddResume;
