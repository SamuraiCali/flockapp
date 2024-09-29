"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, TrendingUp, Clock, Search } from "lucide-react";
import Head from "next/head";
import Header from "@/components/ui/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  location: string;
  rsvpCount: number;
  tag: TagType;
  isGlobal: boolean;
}

// Define tagColors with both default and active styles
const tagColors: { [key in TagType]: { default: string; active: string } } = {
  Sports: {
    default: "bg-blue-100 text-blue-500 border border-blue-500",
    active: "bg-blue-500 text-white",
  },
  Politics: {
    default: "bg-red-100 text-red-500 border border-red-500",
    active: "bg-red-500 text-white",
  },
  Concerts: {
    default: "bg-purple-100 text-purple-500 border border-purple-500",
    active: "bg-purple-500 text-white",
  },
  Protests: {
    default: "bg-yellow-100 text-yellow-500 border border-yellow-500",
    active: "bg-yellow-500 text-white",
  },
  Charity: {
    default: "bg-green-100 text-green-500 border border-green-500",
    active: "bg-green-500 text-white",
  },
  Technology: {
    default: "bg-indigo-100 text-indigo-500 border border-indigo-500",
    active: "bg-indigo-500 text-white",
  },
  Education: {
    default: "bg-teal-100 text-teal-500 border border-teal-500",
    active: "bg-teal-500 text-white",
  },
  Other: {
    default: "bg-gray-100 text-gray-500 border border-gray-500",
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

  const fetchEvents = async () => {
    // Simulating API call
    const mockEvents: Event[] = [
      {
        id: 1,
        title: "Tech Conference",
        date: "2023-10-15",
        location: "San Francisco",
        rsvpCount: 133,
        tag: "Technology",
        isGlobal: false,
      },
      {
        id: 2,
        title: "Music Festival",
        date: "2023-10-22",
        location: "Los Angeles",
        rsvpCount: 507,
        tag: "Concerts",
        isGlobal: false,
      },
      {
        id: 3,
        title: "Political Rally",
        date: "2023-11-05",
        location: "Washington D.C.",
        rsvpCount: 352,
        tag: "Politics",
        isGlobal: false,
      },
      {
        id: 4,
        title: "Sports Tournament",
        date: "2023-11-12",
        location: "Chicago",
        rsvpCount: 242,
        tag: "Sports",
        isGlobal: false,
      },
      {
        id: 5,
        title: "Art Exhibition",
        date: "2023-11-20",
        location: "New York",
        rsvpCount: 195,
        tag: "Other",
        isGlobal: false,
      },
      {
        id: 6,
        title: "Global Climate Strike",
        date: "2023-12-01",
        location: "Worldwide",
        rsvpCount: 671846,
        tag: "Protests",
        isGlobal: true,
      },
      {
        id: 7,
        title: "International Charity Run",
        date: "2023-12-10",
        location: "Multiple Cities",
        rsvpCount: 38762,
        tag: "Charity",
        isGlobal: true,
      },
      {
        id: 8,
        title: "World Education Summit",
        date: "2024-01-15",
        location: "Virtual",
        rsvpCount: 62379,
        tag: "Education",
        isGlobal: true,
      },
      {
        id: 9,
        title: "Global Hackathon",
        date: "2024-02-01",
        location: "Online",
        rsvpCount: 29028,
        tag: "Technology",
        isGlobal: true,
      },
      {
        id: 10,
        title: "International Sports Day",
        date: "2024-03-05",
        location: "Worldwide",
        rsvpCount: 328290,
        tag: "Sports",
        isGlobal: true,
      },
    ];
    setEvents(mockEvents);
    filterEvents(mockEvents, searchInput, activeTag);
  };

  useEffect(() => {
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
    <div className="overflow-x-auto whitespace-nowrap pb-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="inline-block mr-4 max-w-3xl bg-white rounded-lg shadow-md p-4 relative"
        >
          <Link href={`/eventDetails`}>
            <div className="block">
              <div className="absolute top-2 right-1 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold flex items-center">
                <Users size={12} className="mr-1" />
                {event.rsvpCount}
              </div>
              <h4 className="font-bold mb-2 pr-16">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.date}</p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Head>
        <title>Find Events</title>
      </Head>
      <Header />

      <div className="container mx-auto mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search events by name or location"
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2 text-gray-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-4 flex items-center">
                Sort By
                {sortCriteria === "popularity" ? (
                  <TrendingUp className="ml-2" />
                ) : (
                  <Clock className="ml-2" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleSort("popularity")}
                className={sortCriteria === "popularity" ? "font-bold" : ""}
              >
                <TrendingUp className="mr-2" />
                Popularity
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSort("date")}
                className={sortCriteria === "date" ? "font-bold" : ""}
              >
                <Clock className="mr-2" />
                Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex space-x-2 mb-4">
          {(Object.keys(tagColors) as Array<TagType>).map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTag === tag
                  ? tagColors[tag].active
                  : tagColors[tag].default
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <h2 className="font-bold text-lg mb-2">Local Events</h2>
        {filteredLocalEvents.length > 0 ? (
          renderEventCards(filteredLocalEvents)
        ) : (
          <p>No local events found.</p>
        )}

        <h2 className="font-bold text-lg mb-2 mt-6">Global Events</h2>
        {filteredGlobalEvents.length > 0 ? (
          renderEventCards(filteredGlobalEvents)
        ) : (
          <p>No global events found.</p>
        )}
      </div>
    </div>
  );
}
