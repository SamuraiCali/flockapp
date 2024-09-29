"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock } from "lucide-react"; // Updated to import Lucide icons
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";

type TagType =
  | "Sports"
  | "Politics"
  | "Concerts"
  | "Protests"
  | "Charity"
  | "Technology"
  | "Education"
  | "Other";

export default function EventRallyCreator() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: new Date(),
    time: "",
    tag: "" as TagType,
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prevData) => ({ ...prevData, date }));
    }
  };

  const handleTagChange = (value: TagType) => {
    setFormData((prevData) => ({
      ...prevData,
      tag: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newEvent = {
        id: Date.now(),
        title: formData.eventName,
        date: format(formData.date, "yyyy-MM-dd"),
        time: formData.time,
        location: formData.location,
        rsvpCount: 0,
        tag: formData.tag,
        isGlobal: false,
      };

      // Retrieve existing events from local storage
      const existingEvents = localStorage.getItem("events");
      let events = existingEvents ? JSON.parse(existingEvents) : [];

      // Add the new event to the events array
      events.push(newEvent);

      // Save the updated events array back to local storage
      localStorage.setItem("events", JSON.stringify(events));

      // Navigate to the home page
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleNext = () => {
    setCurrentTab((prevTab) => prevTab + 1);
  };

  const handlePrevious = () => {
    setCurrentTab((prevTab) => prevTab - 1);
  };

  const tabs = [
    {
      title: "Who are we floking to?",
      content: (
        <div className="space-y-4">
          <Input
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            placeholder="Enter event name"
          />
        </div>
      ),
    },
    {
      title: "Where are we landing?",
      content: (
        <div className="space-y-4">
          <div className="w-full h-[300px]">
            <iframe
              src="https://storage.googleapis.com/maps-solutions-ht36ai95by/address-selection/lyev/address-selection.html"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Google Maps Address Selection"
            />
          </div>
        </div>
      ),
    },
    {
      title: "When do we fly?",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-gray-400" />
            <span>{format(formData.date, "PPP")}</span>
          </div>
          <Calendar
            mode="single"
            selected={formData.date}
            onSelect={handleDateChange}
            className="rounded-md border"
          />
          <div className="space-y-2">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Add a Tag",
      content: (
        <div className="space-y-4">
          <RadioGroup value={formData.tag} onValueChange={handleTagChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sports" id="sports" />
              <Label htmlFor="sports">Sports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="political" id="political" />
              <Label htmlFor="political">Political</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concerts" id="concerts" />
              <Label htmlFor="concerts">Concerts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="protests" id="protests" />
              <Label htmlFor="protests">Protests</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="charity" id="charity" />
              <Label htmlFor="charity">Charity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tech" id="tech" />
              <Label htmlFor="tech">Technology</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="edu" id="edu" />
              <Label htmlFor="edu">Education</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">Other</Label>
            </div>
          </RadioGroup>
          {formData.tag === "Other" && (
            <div className="mt-2">
              <Label htmlFor="customTag">Custom Tag</Label>
              <Input
                id="customTag"
                name="customTag"
                value={formData.tag}
                onChange={handleInputChange}
                placeholder="Enter custom tag"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Who's leading the flok?",
      content: (
        <div className="space-y-2">
          {" "}
          {/* Adjusted spacing for better visual separation */}
          <div className="border-b border-transparent  pb-1">
            <Label htmlFor="organizerName">Organization Name</Label>
            <Input
              id="organizerName"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleInputChange}
              placeholder="Enter organizer name"
            />
          </div>
          <div className="border-b border-transparent pb-1">
            <Label className="emailLabel">Email</Label>
            <Input
              id="organizerEmail"
              name="organizerEmail"
              type="email"
              value={formData.organizerEmail}
              onChange={handleInputChange}
              placeholder="Enter organizer email"
            />
          </div>
          <div className="border-b border-transparent pb-1">
            <Label className="phoneLabel">Phone #</Label>
            <Input
              id="organizerPhone"
              name="organizerPhone"
              type="tel"
              value={formData.organizerPhone}
              onChange={handleInputChange}
              placeholder="Enter organizer phone"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mt-4 mb-8">
          Create Your Flok Rally
        </h1>
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {tabs[currentTab].title}
          </h2>
          {tabs[currentTab].content}
          <div className="mt-6 flex justify-between">
            {currentTab > 0 && (
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
            )}
            {currentTab < tabs.length - 1 ? (
              <Button onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto">
                Spread your wings
              </Button>
            )}
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h5 className="text-lg font-bold mb-4">flok</h5>
              <p className="text-sm text-gray-600">Find your flok</p>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Resources</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Career</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Internships
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-2">About Us</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Team
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Help</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2024 flok. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
