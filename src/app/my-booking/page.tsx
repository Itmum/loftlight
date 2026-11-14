import CancelBooking from "@/components/cancelbooking";
import { auth } from "@/lib/auth";
import { Booking } from "@/lib/booking";
import { ExternalLink } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function MyBookingPgae() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${user?.email}`,
  );
  const data = await res.json();
  console.log(data);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        My bookings
      </h1>

      {data.length === 0 ? (
        /* Empty state — shown for both layouts */
        <div className="rounded-2xl border bg-card py-12 text-center text-sm text-muted-foreground">
          No bookings found.
        </div>
      ) : (
        <>
          {/* Mobile / tablet: stacked cards */}
          <div className="space-y-4 lg:hidden">
            {data.map((studio: Booking) => (
              <div
                key={studio._id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-serif font-bold text-foreground text-base">
                      {studio.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {studio.location}
                    </div>
                  </div>
                  <Link
                    href={`/studios/${studio.studioId}`}
                    aria-label={`View ${studio.title}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-medium text-muted-foreground">
                    {studio.category}
                  </span>
                  <span className="font-medium text-foreground">
                    ${studio.hourlyRate}/hr
                  </span>
                  <span className="text-muted-foreground">
                    {studio.eventDate}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <CancelBooking id={studio._id}></CancelBooking>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm lg:block">
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
                {data.map((studio: Booking) => (
                  <tr
                    key={studio._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* Studio Title & Location */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
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

                    {/* Actions (Cancel booking) */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <CancelBooking id={studio._id}></CancelBooking>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
