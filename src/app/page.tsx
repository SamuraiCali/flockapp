"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  Clock,
  Search,
  Calendar,
  MapPin,
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TagType =
  | "Sports"
  | "Politics"
  | "Concerts"
  | "Protests"
  | "Charity"
  | "Technology"
  | "Education"
  | "Other";

type SortType = "popularity" | "date";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  tag: TagType;
  isGlobal: boolean;
}

const tagColors: { [key in TagType]: { default: string; active: string } } = {
  Sports: {
    default: "bg-blue-100 text-blue-500 hover:bg-blue-200",
    active: "bg-blue-500 text-white",
  },
  Politics: {
    default: "bg-red-100 text-red-500 hover:bg-red-200",
    active: "bg-red-500 text-white",
  },
  Concerts: {
    default: "bg-purple-100 text-purple-500 hover:bg-purple-200",
    active: "bg-purple-500 text-white",
  },
  Protests: {
    default: "bg-yellow-100 text-yellow-500 hover:bg-yellow-200",
    active: "bg-yellow-500 text-white",
  },
  Charity: {
    default: "bg-green-100 text-green-500 hover:bg-green-200",
    active: "bg-green-500 text-white",
  },
  Technology: {
    default: "bg-indigo-100 text-indigo-500 hover:bg-indigo-200",
    active: "bg-indigo-500 text-white",
  },
  Education: {
    default: "bg-teal-100 text-teal-500 hover:bg-teal-200",
    active: "bg-teal-500 text-white",
  },
  Other: {
    default: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    active: "bg-gray-500 text-white",
  },
};

export default function HomePage() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredLocalEvents, setFilteredLocalEvents] = useState<Event[]>([]);
  const [filteredGlobalEvents, setFilteredGlobalEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sortCriteria, setSortCriteria] = useState<SortType>("popularity");
  const [activeTag, setActiveTag] = useState<TagType | null>(null);

  useEffect(() => {
    const fetchEvents = () => {
      // Retrieve events from local storage
      const storedEvents = localStorage.getItem("events");
      let eventsList: Event[] = storedEvents ? JSON.parse(storedEvents) : [];

      // Mock events that should always be included
      const mockEvents: Event[] = [
        {
          id: 1,
          title: "Tech Conference",
          date: "2023-10-15",
          time: "10:00 AM",
          location: "San Francisco",
          rsvpCount: 133,
          tag: "Technology",
          isGlobal: false,
        },
        {
          id: 2,
          title: "Music Festival",
          date: "2023-10-22",
          time: "2:00 PM",
          location: "Los Angeles",
          rsvpCount: 507,
          tag: "Concerts",
          isGlobal: false,
        },
        {
          id: 3,
          title: "Political Rally",
          date: "2023-11-05",
          time: "9:00 AM",
          location: "Washington D.C.",
          rsvpCount: 352,
          tag: "Politics",
          isGlobal: false,
        },
        {
          id: 10,
          title: "International Sports Day",
          date: "2024-03-05",
          time: "11:00 AM",
          location: "Worldwide",
          rsvpCount: 328290,
          tag: "Sports",
          isGlobal: true,
        },
      ];

      // Combine stored events with mock events
      eventsList = [...eventsList, ...mockEvents];

      // Save combined events to local storage if it was empty
      if (storedEvents === null) {
        localStorage.setItem("events", JSON.stringify(eventsList));
      }

      setEvents(eventsList);
      filterEvents(eventsList, searchInput, activeTag);
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    filterEvents(events, value, activeTag);
  };

  const handleTagClick = (tag: TagType) => {
    const newActiveTag = activeTag === tag ? null : tag;
    setActiveTag(newActiveTag);
    filterEvents(events, searchInput, newActiveTag);
  };

  const filterEvents = (
    allEvents: Event[],
    search: string,
    tag: TagType | null
  ) => {
    let filtered = allEvents;
    if (search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (tag) {
      filtered = filtered.filter((event) => event.tag === tag);
    }
    const localEvents = filtered.filter((event) => !event.isGlobal);
    const globalEvents = filtered.filter((event) => event.isGlobal);
    setFilteredLocalEvents(sortEvents(localEvents, sortCriteria));
    setFilteredGlobalEvents(sortEvents(globalEvents, sortCriteria));
  };

  const handleSort = (criteria: SortType) => {
    setSortCriteria(criteria);
    setFilteredLocalEvents(sortEvents(filteredLocalEvents, criteria));
    setFilteredGlobalEvents(sortEvents(filteredGlobalEvents, criteria));
  };

  const sortEvents = (eventsToSort: Event[], criteria: SortType): Event[] => {
    return [...eventsToSort].sort((a, b) => {
      if (criteria === "popularity") {
        return b.rsvpCount - a.rsvpCount;
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  };

  const renderEventCards = (events: Event[]) => (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 pb-4">
        {events.map((event) => (
          <Card key={event.id} className="w-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {event.tag}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto">
              <div className="flex items-center space-x-1 text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>{event.rsvpCount}</span>
              </div>
              <Button size="sm">RSVP</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Find Events</title>
      </Head>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events by name or location"
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Sort By: {sortCriteria === "popularity" ? "Popularity" : "Date"}
                {sortCriteria === "popularity" ? (
                  <TrendingUp className="ml-2 h-4 w-4" />
                ) : (
                  <Clock className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("popularity")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Popularity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("date")}>
                <Clock className="mr-2 h-4 w-4" />
                Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(tagColors) as Array<TagType>).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={`cursor-pointer ${
                activeTag === tag
                  ? tagColors[tag].active
                  : tagColors[tag].default
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Local Events</h2>
          {filteredLocalEvents.length > 0 ? (
            renderEventCards(filteredLocalEvents)
          ) : (
            <p className="text-muted-foreground">No local events found.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Global Events</h2>
          {filteredGlobalEvents.length > 0 ? (
            renderEventCards(filteredGlobalEvents)
          ) : (
            <p className="text-muted-foreground">No global events found.</p>
          )}
        </section>
      </main>
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto text-center max-w-6xl">
          <h4 className="text-2xl font-bold mb-4">About Us</h4>
          <p className="text-med text-gray-600">
            Our mission is to promote rallies all around the world, empowering
            individuals and communities to come together and make a difference.
            We provide a platform where users can create their own rallies,
            offering a space for those brave enough to take the first step in
            speaking out. Whether it's for social justice, political reform, or
            any cause that ignites passion, we believe in giving everyone the
            chance to be part of the change.
          </p>
        </div>
      </section>
      <footer className="bg-gray-100 py-8">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {" "}
            <div>
              <p className="text-sm text-gray-600">Find your flok</p>{" "}
            </div>{" "}
            <div>
              <h6 className="font-semibold mb-2">Resources</h6>{" "}
              <ul className="text-sm space-y-2">
                {" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Blog{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Guides{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            <div>
              <h6 className="font-semibold mb-2">Career</h6>{" "}
              <ul className="text-sm space-y-2">
                {" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Jobs{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Internships{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            <div>
              <h6 className="font-semibold mb-2">About Us</h6>{" "}
              <ul className="text-sm space-y-2">
                {" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Our Story{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Team{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            <div>
              <h6 className="font-semibold mb-2">Help</h6>{" "}
              <ul className="text-sm space-y-2">
                {" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    FAQ{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Contact Us{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            {" "}
            <p className="text-sm text-gray-600">
              &copy; 2024 <b>flok.</b> All rights reserved.
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </footer>
    </div>
  );
}
