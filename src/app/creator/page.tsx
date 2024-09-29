"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Tag,
  User,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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
    description: "",
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
  });
  const [completedSteps, setCompletedSteps] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        description: formData.description,
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          phone: formData.organizerPhone,
        },
      };

      const existingEvents = localStorage.getItem("events");
      let events = existingEvents ? JSON.parse(existingEvents) : [];
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));

      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleNext = () => {
    if (isStepComplete(currentTab)) {
      setCurrentTab((prevTab) => prevTab + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentTab((prevTab) => prevTab - 1);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return (
          formData.eventName.trim() !== "" && formData.description.trim() !== ""
        );
      case 1:
        return formData.location.trim() !== "";
      case 2:
        return formData.time.trim() !== "";
      case 3:
        return formData.tag !== undefined;
      case 4:
        return (
          formData.organizerName.trim() !== "" &&
          formData.organizerEmail.trim() !== "" &&
          formData.organizerPhone.trim() !== ""
        );
      default:
        return false;
    }
  };

  useEffect(() => {
    const newCompletedSteps = completedSteps.map((_, index) =>
      isStepComplete(index)
    );
    setCompletedSteps(newCompletedSteps);
  }, [formData]);

  const tabs = [
    {
      title: "Event Details",
      icon: <Users className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Enter event name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Event Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your event"
              rows={4}
              required
            />
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      icon: <MapPin className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="location">Event Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter event location"
              required
            />
          </div>
          <div className="w-full h-[300px] rounded-md overflow-hidden">
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
      title: "Date & Time",
      icon: <CalendarIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label>Event Date</Label>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={handleDateChange}
              className="rounded-md border p-4 bg-white shadow-lg"
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day: "hover:bg-muted",
              }}
            />
          </div>
          <div>
            <Label htmlFor="time">Event Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      icon: <Tag className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <Label>Event Category</Label>
          <RadioGroup
            value={formData.tag}
            onValueChange={handleTagChange}
            className="grid grid-cols-2 gap-4"
          >
            {[
              "Sports",
              "Politics",
              "Concerts",
              "Protests",
              "Charity",
              "Technology",
              "Education",
              "Other",
            ].map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={tag}
                  id={tag.toLowerCase()}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={tag.toLowerCase()}
                  className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {tag}
                </Label>
              </div>
            ))}
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
      title: "Organizer",
      icon: <User className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="organizerName">Organization Name</Label>
            <Input
              id="organizerName"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleInputChange}
              placeholder="Enter organizer name"
              required
            />
          </div>
          <div>
            <Label htmlFor="organizerEmail">Email</Label>
            <Input
              id="organizerEmail"
              name="organizerEmail"
              type="email"
              value={formData.organizerEmail}
              onChange={handleInputChange}
              placeholder="Enter organizer email"
              required
            />
          </div>
          <div>
            <Label htmlFor="organizerPhone">Phone Number</Label>
            <Input
              id="organizerPhone"
              name="organizerPhone"
              type="tel"
              value={formData.organizerPhone}
              onChange={handleInputChange}
              placeholder="Enter organizer phone"
              required
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Create Your Flok Rally
            </CardTitle>
            <CardDescription className="text-center">
              Spread your wings and gather your flock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={currentTab.toString()}
              onValueChange={(value: string) => setCurrentTab(parseInt(value))}
            >
              <TabsList className="grid w-full grid-cols-5">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    disabled={index > currentTab}
                    className="relative"
                  >
                    {completedSteps[index] ? (
                      <Check className="w-4 h-4 text-green-500 absolute top-1 right-1" />
                    ) : null}
                    {tab.icon}
                    <span className="hidden md:inline ml-2">{tab.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{tab.title}</CardTitle>
                      <CardDescription>
                        Step {index + 1} of {tabs.length}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>{tab.content}</CardContent>
                    <CardFooter className="flex justify-between">
                      {index > 0 && (
                        <Button onClick={handlePrevious} variant="outline">
                          Previous
                        </Button>
                      )}
                      {index < tabs.length - 1 ? (
                        <Button
                          onClick={handleNext}
                          className="ml-auto"
                          disabled={!isStepComplete(index)}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          className="ml-auto"
                          disabled={!isStepComplete(index)}
                        >
                          Fly Away
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter>
            <Progress
              value={((currentTab + 1) / tabs.length) * 100}
              className="w-full"
            />
          </CardFooter>
        </Card>
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
