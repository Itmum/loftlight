"use client";
import React from "react";
import { Studio } from "@/lib/studio";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { toast } from "sonner";

const BookingCard = ({ studio }: { studio: Studio }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const eventDate = formData.get("eventDate") as string;
    const { _id: studioId, ...studioRest } = studio;
    const data = {
      userName: user?.name,
      userEmail: user?.email,
      userImage: user?.image,
      studioId,
      ...studioRest,
      eventDate: eventDate,
      bookingDate: new Date(),
    };

    const toastId = toast.loading("Processing booking...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // 👈 Uncommented to send session/auth cookies
        body: JSON.stringify(data),
      });

      // Safely read response as text first in case it's an HTML error page
      const responseText = await res.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error(responseText || "Server returned an invalid response.");
      }

      if (!res.ok) {
        throw new Error(responseData?.message || "Failed to create booking.");
      }

      toast.success("Booking confirmed successfully!", { id: toastId });
      console.log(responseData);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong.",
        {
          id: toastId,
        },
      );
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-CA");
  };

  return (
    <aside className="lg:sticky lg:top-10">
      <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
        <p className="font-serif text-4xl font-bold text-primary">
          ${studio.hourlyRate}
          <span className="font-sans text-base font-normal text-muted-foreground">
            {" "}
            / hr
          </span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Security deposit ${studio.deposit}, refunded after your session.
        </p>
        <form onSubmit={handleBooking}>
          <input
            type="date"
            name="eventDate"
            aria-label="Event date"
            defaultValue={getTomorrowDate()}
            className="mt-4 w-full px-2 py-3 rounded-xl border-2"
          />

          <Button
            type="submit"
            className="mt-5 h-12 w-full text-sm font-semibold"
          >
            Book Workspace Now
          </Button>
        </form>
      </div>
    </aside>
  );
};

export default BookingCard;
