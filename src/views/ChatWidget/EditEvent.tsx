import moment from "moment";
import React, { useState } from "react";

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
        date: new Date('2024-01-01'),
        time: "7:00 PM - 10:00 PM",
        title: "Cannabis Conclave",
        description: "A premier networking event for cannabis industry leaders, featuring keynote speakers, workshops, and an expo floor. Age restrictions apply.",
        location: "Downtown Conference Center",
        imageUrl: "/images/cannabis-conclave.jpg",
    },
];

const EditEvent: React.FC<{ event: Event; onSave: (updatedEvent: Event) => void; onCancel: () => void; }> = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Event>(event);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
console.log("hello formdata",formData)
    return (
        <div className="max-w-lg bg-white rounded-lg shadow-md">
            <div className="flex items-center rounded p-1">
                <img src="/images/StoreHeader.jpeg" alt="Sample Image" className="rounded-full w-[35px] h-[35px]" />
                <div className="flex flex-col px-2">
                    <p className="text-xl font-medium">Edit Events Details :</p>
                </div>

            </div>
            <div className="space-y-3 flex flex-col justify-between">
                <label className="font-medium">Event Name</label>
                <input type="text" name="title" placeholder="Enter Event Name" value={formData.title} onChange={handleChange} className="w-full border rounded-md p-2" />
                <div className="flex space-x-2">
                    <div className="flex flex-col flex-1 mr-2">
                    <label className="font-medium">Date</label>
                    <input type="date" name="date" value={formData.date.toDateString()} onChange={handleChange} className=" border rounded-md p-2" />
                    </div>
                    <div className="flex flex-col flex-1">
                    <label className="font-medium">Time</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} className=" border rounded-md p-2" />
                    </div>
                </div>
                <label className="font-medium">Location</label>
                <input type="text" name="location" placeholder="Enter Location" value={formData.location} onChange={handleChange} className="w-full border rounded-md p-2" />
                <label className="font-medium">Description</label>
                <textarea name="description" placeholder="Enter Description" value={formData.description} onChange={handleChange} className="w-full border rounded-md p-2"></textarea>
                <div className="flex space-x-2">
                    <button onClick={onCancel} className="border px-4 py-2 rounded-md flex-1">Cancel</button>
                    <button onClick={() => onSave(formData)} className="bg-[var(--primary-color)] flex items-center justify-center p-2 text-white font-semibold rounded-lg flex-1">Change Details</button>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
