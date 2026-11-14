import CancelBooking from "@/components/cancelbooking";
import DeleteStudioDialog from "@/components/deleteStudioDialog";
import { StudioCard } from "@/components/studio-card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Booking } from "@/lib/booking";
import { Studio } from "@/lib/studio";
import { ExternalLink, Link2, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function MyBookingPgae() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const res = await fetch(`http://localhost:8000/my-bookings/${user?.email}`);
  const data = await res.json();
  console.log(data);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header section with title and Add studio button */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My studio listings
        </h1>
        {/* <Button className="rounded-full bg-[#a34739] w-48 px-2 py-2 font-medium text-white hover:bg-[#a34739]/90">
          <Link href="/add-studio" className="flex justify-center items-center">
            <Plus className="mr-1.5 size-4" /> Add studio
          </Link>
        </Button> */}
      </div>

      {/* Table Container wrapped in a card box */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b text-muted-foreground font-medium">
              <th className="py-4 px-6">Studio</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Rate</th>
              <th className="py-4 px-6">Event Date</th>
              <th className="py-4 px-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground"
                >
                  No studio listings found.
                </td>
              </tr>
            ) : (
              data.map((studio: Booking) => (
                <tr
                  key={studio._id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Studio Title & Location */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <Link href={`/studios/${studio.studioId}`}>
                      <ExternalLink></ExternalLink>
                    </Link>
                    <div>
                      <div className="font-serif font-bold text-foreground text-base">
                        {studio.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {studio.location}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 text-muted-foreground font-medium">
                    {studio.category}
                  </td>

                  {/* Rate */}
                  <td className="py-4 px-6 font-medium text-foreground">
                    ${studio.hourlyRate}/hr
                  </td>

                  <td className="py-4 px-6 font-medium text-foreground">
                    {studio.eventDate}
                  </td>

                  {/* Actions (Update & Delete) */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CancelBooking id={studio._id}></CancelBooking>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
