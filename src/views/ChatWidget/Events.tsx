import React, { useState } from "react";
import EventDetails from "./EventDetail";
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

const events: Event[] = [
  {
    id: 1,
    date: new Date("2024-01-01"),
    time: "7 PM",
    title: "Cannabis Conclave",
    description: "Networking event for industry professionals.",
    imageUrl: "/images/events/cannabis.png",
    location: "abc",
  },
  {
    id: 2,
    date: new Date("2024-01-01"),
    time: "12 PM",
    title: "420 Fest",
    description: "Celebration and music festival.",
    imageUrl: "/images/events/240-fest.png",
    location: "abc",
  },
  {
    id: 3,
    date: new Date("2024-01-01"),
    time: "7 PM",
    title: "420 Fest",
    description: "Celebration and music festival.",
    imageUrl: "/images/events/240-fest-2.png",
    location: "abc",
  },
  {
    id: 3,
    date: new Date("2024-01-01"),
    time: "7 PM",
    title: "420 Fest",
    description: "Celebration and music festival.",
    imageUrl: "/images/events/240-fest-2.png",
    location: "abc",
  },
  {
    id: 3,
    date: new Date("2024-01-01"),
    time: "7 PM",
    title: "420 Fest",
    description: "Celebration and music festival.",
    imageUrl: "/images/events/240-fest-2.png",
    location: "abc",
  },
];

const EventList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  return (
    <>
      {!selectedEvent ? (
        <div className="px-4 overflow-auto mt-3">
          <div className="grid grid-cols-2 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-30 object-cover max-w-full"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    {moment(event.date).format("MMM Do")}, {event.time}
                  </p>
                  <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EventDetails
          event={selectedEvent}
          setSelectedItem={setSelectedEvent}
        />
      )}
    </>
  );
};

export default EventList;
