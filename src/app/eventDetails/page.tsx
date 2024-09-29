import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Mail, Phone } from "lucide-react";
import Header from "@/components/ui/header";

export default function EventDetailsPage() {
  // Sample event data
  const eventData = {
    title: "Summer Music Festival",
    organization: "Harmony Events",
    date: "2024-07-15",
    time: "14:00",
    location: "Central Park, New York",
    rsvpCount: 1500,
    summary:
      "Join us for a day of music and fun at the annual Summer Music Festival! Featuring top artists from around the world, food vendors, and activities for all ages. Don't miss out on the biggest music event of the summer!",
    photos: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    organizerEmail: "info@harmonyevents.com",
    organizerPhone: "+1 (555) 123-4567",
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Event Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{eventData.summary}</p>
              </CardContent>
            </Card>

            {/* Event Photos Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {eventData.photos.map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      alt={`Event photo ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg"
                      // Optionally add loading or error handling props here
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <a
                    href={`mailto:${eventData.organizerEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {eventData.organizerEmail}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  <a
                    href={`tel:${eventData.organizerPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {eventData.organizerPhone}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Event Date and Location Card */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {new Date(eventData.date).toLocaleDateString()} at{" "}
                    {eventData.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{eventData.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{eventData.rsvpCount} people have RSVP'd</span>
                </div>
              </CardContent>
            </Card>

            {/* Event Location Map Card */}
            <Card>
              <CardContent className="pt-6">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Event location map"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  // Optionally add loading or error handling props here
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
