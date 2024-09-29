"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  Clock,
  Search,
  Calendar,
  MapPin,
  ChevronRight,
  Check,
  ThumbsUp,
} from "lucide-react";
import Head from "next/head";
import Header from "@/components/ui/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TagType =
  | "Sports"
  | "Politics"
  | "Concerts"
  | "Protests"
  | "Charity"
  | "Technology"
  | "Education"
  | "Other";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  tag: TagType;
  isGlobal: boolean;
  image?: string;
  description?: string;
  organizer?: {
    name: string;
    email: string;
    phone: string;
  };
};

const tagColors: Record<TagType, { default: string; active: string }> = {
  Sports: {
    default: "bg-blue-100 text-blue-800",
    active: "bg-blue-500 text-white",
  },
  Politics: {
    default: "bg-red-100 text-red-800",
    active: "bg-red-500 text-white",
  },
  Concerts: {
    default: "bg-purple-100 text-purple-800",
    active: "bg-purple-500 text-white",
  },
  Protests: {
    default: "bg-yellow-100 text-yellow-800",
    active: "bg-yellow-500 text-white",
  },
  Charity: {
    default: "bg-green-100 text-green-800",
    active: "bg-green-500 text-white",
  },
  Technology: {
    default: "bg-indigo-100 text-indigo-800",
    active: "bg-indigo-500 text-white",
  },
  Education: {
    default: "bg-pink-100 text-pink-800",
    active: "bg-pink-500 text-white",
  },
  Other: {
    default: "bg-gray-100 text-gray-800",
    active: "bg-gray-500 text-white",
  },
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredLocalEvents, setFilteredLocalEvents] = useState<Event[]>([]);
  const [filteredGlobalEvents, setFilteredGlobalEvents] = useState<Event[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortCriteria, setSortCriteria] = useState<"popularity" | "date">(
    "date"
  );
  const [activeTag, setActiveTag] = useState<TagType | null>(null);
  const [rsvpedEvents, setRsvpedEvents] = useState<number[]>([]);
  const [rsvpAnimation, setRsvpAnimation] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    const parsedEvents: Event[] = storedEvents ? JSON.parse(storedEvents) : [];

    const mockEvents: Event[] = [
      {
        id: 1,
        title: "Tech Conference 2024",
        date: "2024-06-15",
        time: "09:00 AM",
        location: "San Francisco, CA",
        rsvpCount: 1500,
        tag: "Technology",
        isGlobal: false,
        image: "/balls.png",
      },
      {
        id: 2,
        title: "Summer Music Festival",
        date: "2024-07-22",
        time: "02:00 PM",
        location: "Los Angeles, CA",
        rsvpCount: 5000,
        tag: "Concerts",
        isGlobal: false,
        image: "/rave.png",
      },
      {
        id: 3,
        title: "Local Town Hall Meeting",
        date: "2024-05-05",
        time: "07:00 PM",
        location: "Boston, MA",
        rsvpCount: 200,
        tag: "Politics",
        isGlobal: false,
        image: "/wh.png",
      },
      {
        id: 4,
        title: "Charity Run for Education",
        date: "2024-09-10",
        time: "08:00 AM",
        location: "Chicago, IL",
        rsvpCount: 1000,
        tag: "Charity",
        isGlobal: false,
        image: "/hands.png",
      },
      {
        id: 5,
        title: "Environmental Protest",
        date: "2024-04-22",
        time: "10:00 AM",
        location: "Seattle, WA",
        rsvpCount: 3000,
        tag: "Protests",
        isGlobal: false,
        image: "/fists.png",
      },
      {
        id: 6,
        title: "World Cup Viewing Party",
        date: "2024-07-10",
        time: "03:00 PM",
        location: "New York, NY",
        rsvpCount: 5000,
        tag: "Sports",
        isGlobal: false,
        image: "/balls.png",
      },
      {
        id: 7,
        title: "Global Climate Summit",
        date: "2024-11-15",
        time: "09:00 AM",
        location: "Virtual Event",
        rsvpCount: 100000,
        tag: "Education",
        isGlobal: true,
        image: "/wh.png",
      },
      {
        id: 8,
        title: "International Peace Day Celebration",
        date: "2024-09-21",
        time: "12:00 PM",
        location: "Worldwide",
        rsvpCount: 500000,
        tag: "Other",
        isGlobal: true,
        image: "/wh.png",
      },
    ];
    const allEvents = [...mockEvents, ...parsedEvents];
    setEvents(allEvents);
    filterEvents(allEvents, searchInput, activeTag);

    // Load RSVPed events from localStorage
    const storedRsvpedEvents = localStorage.getItem("rsvpedEvents");
    if (storedRsvpedEvents) {
      setRsvpedEvents(JSON.parse(storedRsvpedEvents));
    }
  }, []);

  const filterEvents = (
    allEvents: Event[],
    search: string,
    tag: TagType | null
  ) => {
    const filtered = allEvents.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTag = tag ? event.tag === tag : true;
      return matchesSearch && matchesTag;
    });

    const sortedEvents = [...filtered].sort((a, b) => {
      if (sortCriteria === "popularity") {
        return b.rsvpCount - a.rsvpCount;
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setFilteredLocalEvents(sortedEvents.filter((event) => !event.isGlobal));
    setFilteredGlobalEvents(sortedEvents.filter((event) => event.isGlobal));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchInput = e.target.value;
    setSearchInput(newSearchInput);
    filterEvents(events, newSearchInput, activeTag);
  };

  const handleSort = (criteria: "popularity" | "date") => {
    setSortCriteria(criteria);
    filterEvents(events, searchInput, activeTag);
  };

  const handleTagClick = (tag: TagType) => {
    const newActiveTag = activeTag === tag ? null : tag;
    setActiveTag(newActiveTag);
    filterEvents(events, searchInput, newActiveTag);
  };

  const getTagColor = (tag: TagType) => {
    return tagColors[tag] || tagColors.Other;
  };

  const handleRSVP = (eventId: number) => {
    if (!rsvpedEvents.includes(eventId)) {
      const newRsvpedEvents = [...rsvpedEvents, eventId];
      setRsvpedEvents(newRsvpedEvents);
      localStorage.setItem("rsvpedEvents", JSON.stringify(newRsvpedEvents));

      const updatedEvents = events.map((event) =>
        event.id === eventId
          ? { ...event, rsvpCount: event.rsvpCount + 1 }
          : event
      );
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      filterEvents(updatedEvents, searchInput, activeTag);

      // Trigger animation
      setRsvpAnimation((prev) => ({ ...prev, [eventId]: true }));
      setTimeout(() => {
        setRsvpAnimation((prev) => ({ ...prev, [eventId]: false }));
      }, 1000);
    }
  };

  const renderEventCards = (events: Event[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg overflow-hidden group">
          <Link href={`/eventDetails`} className="flex-grow">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold line-clamp-1">
                  {event.title}
                </CardTitle>
              </div>
              <Badge
                variant="secondary"
                className={`w-fit mt-2 ${getTagColor(event.tag).default}`}
              >
                {event.tag}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Link>
          <CardFooter className="justify-between items-center">
            <div className="flex items-center space-x-1 text-sm font-medium">
              <Users className="h-4 w-4" />
              <span className={rsvpAnimation[event.id] ? "animate-pulse" : ""}>
                {event.rsvpCount} RSVPs
              </span>
            </div>
            <Button
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                handleRSVP(event.id);..
              }}
              disabled={rsvpedEvents.includes(event.id)}
              className={`transition-all p-2 duration-300 ${
                rsvpedEvents.includes(event.id)
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {rsvpedEvents.includes(event.id) ? (
                <>
                  <Check className="mr-4 h-8 w-8" />
                </>
              ) : (
                <>
                  <ThumbsUp className="size-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Head>
        <title>Rally Meets</title>
        <meta name="description" content="Find and RSVP to rally events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-4 mt-16">
        <h1 className="text-4xl font-bold mb-8">Discover Events</h1>
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search events..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="pl-5"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {sortCriteria === "popularity" ? (
                      <TrendingUp className="mr-2 h-4 w-4" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    {sortCriteria === "popularity" ? "Popular" : "Recent"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("popularity")}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("date")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Recent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Tabs defaultValue="local" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local">Local Events</TabsTrigger>
                <TabsTrigger value="global">Global Events</TabsTrigger>
              </TabsList>
              <TabsContent value="local" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Local Events</h2>
                {renderEventCards(filteredLocalEvents)}
              </TabsContent>
              <TabsContent value="global" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Global Events</h2>
                {renderEventCards(filteredGlobalEvents)}
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-6">
            <Card className="sticky top-24 self-start">
              <CardHeader>
                <CardTitle>Filter by Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(tagColors).map((tag) => (
                    <Button
                      key={tag}
                      onClick={() => handleTagClick(tag as TagType)}
                      variant="outline"
                      size="sm"
                      className={`rounded-full ${
                        activeTag === tag
                          ? tagColors[tag as TagType].active
                          : tagColors[tag as TagType].default
                      }`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h5 className="text-lg font-bold mb-4">flok</h5>
              <p className="text-sm text-muted-foreground">Find your flok</p>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Resources</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Career</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Internships
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-2">About Us</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Team
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Help</h6>
              <ul className="text-sm space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-muted-foreground/10 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 flok. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
