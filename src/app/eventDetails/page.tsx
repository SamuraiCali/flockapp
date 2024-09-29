import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  Share2,
  Heart,
} from "lucide-react";
import Header from "@/components/ui/header";
import { Badge } from "@/components/ui/badge";

export default function EventDetailsPage() {
  // Sample event data
  const eventData = {
    title: "FIU Shellhacks Afterparty",
    organization: "Init and Friends",
    date: "2024-09-30",
    time: "22:00",
    location: "Miami, FL",
    rsvpCount: 200,
    summary:
      "Join us for a day of music and fun at the annual FIU Shellhacks Afterparty! Featuring top artists from around the world, food vendors, and activities for all ages. Don't miss out on the biggest party of the year!",
    organizerEmail: "info@fiu.edu",
    organizerPhone: "+1 (555) 123-4567",
    tag: "Concerts",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{eventData.title}</h1>
          <p className="text-xl text-muted-foreground">
            Organized by {eventData.organization}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">
                  Event Details
                </CardTitle>
                <Badge variant="secondary">{eventData.tag}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(eventData.date).toLocaleDateString()} at{" "}
                      {eventData.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <MapPin className="h-4 w-4" />
                    <span>{eventData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{eventData.rsvpCount} RSVPs</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About this event</h3>
                  <p className="text-muted-foreground">{eventData.summary}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6, space-x-5">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`mailto:${eventData.organizerEmail}`}
                    className="text-primary hover:underline"
                  >
                    {eventData.organizerEmail}
                  </a>
                </div>
                <div className="flex items-center space-x-5,">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`tel:${eventData.organizerPhone}`}
                    className="text-primary hover:underline"
                  >
                    {eventData.organizerPhone}
                  </a>
                </div>
                <div className="flex justify-between pt-4, transform-y-5">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share event</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Similar Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No similar events found.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
