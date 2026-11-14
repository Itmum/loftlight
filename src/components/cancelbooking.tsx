"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Props = {
  id: string;
  title?: string; // shown in the message, e.g. “The Cyc Wall Loft”
  onDeleted?: () => void; // optional: run your own code after a delete
};

const CancelBooking = ({ id, title, onDeleted }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCancelbooking = async () => {
    if (deleting) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting studio…");

    try {
      let res: Response;
      try {
        res = await fetch(`${API_URL}/my-bookings/${id}`, {
          method: "DELETE",
          // credentials: "include", // turn on later for the HTTPOnly JWT cookie
        });
      } catch {
        throw new Error(
          "Can’t reach the server. Check your connection and try again.",
        );
      }

      if (res.status === 401)
        throw new Error("Your session expired. Please log in again.");
      if (res.status === 403)
        throw new Error("You can only delete your own studios.");

      // 404 means it's already gone, so the list just needs a refresh
      if (res.status === 404) {
        toast.info("This studio was already deleted.", { id: toastId });
      } else if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ?? "Couldn’t delete the studio. Please try again.",
        );
      } else {
        toast.success("Studio deleted.", { id: toastId });
      }

      setOpen(false);
      if (onDeleted) onDeleted();
      else router.refresh(); // reloads the page's server data so the row disappears
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong.",
        { id: toastId },
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      // don't let the user close the dialog while the delete is running
      onOpenChange={(next) => {
        if (!deleting) setOpen(next);
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            size="sm"
            className="rounded-full bg-[#a34739] px-4 text-xs font-medium text-white hover:bg-[#a34739]/90"
          >
            Cancel
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
          <AlertDialogDescription>
            {title ? (
              <>
                This will permanently delete <strong>“{title}”</strong> and its
                listing. This can’t be undone.
              </>
            ) : (
              "This will permanently delete your studio listing. This can’t be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>
            Keep Booking
          </AlertDialogCancel>
          {/* A normal Button (not AlertDialogAction) so the dialog stays open until the delete finishes */}
          <Button
            type="button"
            disabled={deleting}
            onClick={handleCancelbooking}
            className="bg-[#a34739] text-white hover:bg-[#a34739]/90"
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            {deleting ? "Deleting…" : "Yes, Cancel booking"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBooking;
