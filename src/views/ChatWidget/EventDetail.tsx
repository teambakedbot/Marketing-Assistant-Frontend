import React, { useState } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import EditEvent from "./EditEvent";
import moment from "moment";

interface Event {
  id: number;
  date: Date;
  time: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
}
interface EventDetailsProps {
  event: Event;
  setSelectedItem: React.Dispatch<React.SetStateAction<Event | null>>;
}
const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  setSelectedItem,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [cancelConfirm, setCancelConfirm] = useState<boolean>(false);

  const onSave = (event) => {
    setSelectedItem(event);
  };

  const onCancel = () => {
    setEditMode(false);
  };

  const CancelConfirmation: React.FC = () => {
    return (
      <div className="mx-1">
        <div className="flex items-center rounded p-1">
          <img
            src="/images/StoreHeader.jpeg"
            alt="Sample Image"
            className="rounded-full w-[35px] h-[35px]"
          />
          <div className="flex flex-col px-2">
            <p className="text-xl font-semibold py-2">Cancel Confirmation :</p>
          </div>
        </div>
        <div>
          <p>
            Are you sure you want to cancel {event.title} on{" "}
            {moment(event.date).format("MMMM Do")}?
          </p>
        </div>
        <div className="mt-2 flex space-x-2">
          <button
            className="flex items-center justify-center p-2 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded-lg flex-1"
            onClick={() => setCancelConfirm(false)}
          >
            Yes, Cancel Event
          </button>
          <button
            className="flex items-center justify-center p-2 bg-[var(--primary-color)] text-white font-semibold rounded-lg flex-1"
            onClick={() => setCancelConfirm(false)}
          >
            No Keep Event
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {" "}
      {editMode ? (
        <EditEvent event={event} onSave={onSave} onCancel={onCancel} />
      ) : (
        <div
          className={`max-w-lg bg-white rounded-lg shadow-md ${
            cancelConfirm ? "overflow-y-scroll overflow-x-hidden" : ""
          }`}
        >
          <div className="mx-1 mt-3">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-[7rem] object-cover rounded-md"
            />
          </div>
          <div className="py-4 flex flex-col justify-between mx-1">
            <p className="my-1">
              <label className="font-medium">Event Name:</label> {event.title}
            </p>
            <p className="my-1">
              <label className="font-medium">Date:</label>{" "}
              {event.date.toDateString()}
            </p>
            <p className="my-1">
              <label className="font-medium">Time:</label> {event.time}
            </p>
            <p className="my-1">
              <label className="font-medium">Location:</label>
            </p>
            <p className="my-1">
              <label className="font-medium">Description:</label>{" "}
              {event.description}
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-[var(--primary-color)] flex items-center justify-center p-2 text-white font-semibold rounded-lg flex-1"
                onClick={() => setEditMode(true)}
              >
                <TbEdit />
                <span className="mx-2"> Edit</span>
              </button>
              <button className="bg-[#FE3131] flex items-center justify-center p-2 text-white font-semibold rounded-lg flex-1">
                <FaTrashAlt />
                <span className="mx-2">Delete</span>
              </button>
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                className="flex items-center justify-center p-2 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded-lg flex-1"
                onClick={() => setCancelConfirm(true)}
              >
                <MdCancel />
                <span className="mx-2"> Cancel </span>
              </button>
              <button
                className="flex items-center justify-center p-2 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded-lg flex-1"
                onClick={() => setSelectedItem(null)}
              >
                <FaArrowLeft />
                <span className="mx-2"> Back to Events </span>
              </button>
            </div>
          </div>
          {cancelConfirm && <CancelConfirmation />}
        </div>
      )}
    </>
  );
};

export default EventDetails;
