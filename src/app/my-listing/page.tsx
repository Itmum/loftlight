import DeleteStudioDialog from "@/components/deleteStudioDialog";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Studio } from "@/lib/studio";
import { ExternalLink, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function MyListingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const res = await fetch(
    `http://localhost:8000/all-studios/owner/${user?.email}`,
  );
  const data = await res.json();
  //   console.log(data);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header section with title and Add studio button */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My studio listings
        </h1>
        <Button className="w-full rounded-full bg-[#a34739] px-2 py-2 font-medium text-white hover:bg-[#a34739]/90 sm:w-48">
          <Link href="/add-studio" className="flex justify-center items-center">
            <Plus className="mr-1.5 size-4" /> Add studio
          </Link>
        </Button>
      </div>

      {data.length === 0 ? (
        /* Empty state — shown for both layouts */
        <div className="rounded-2xl border bg-card py-12 text-center text-sm text-muted-foreground">
          No studio listings found.
        </div>
      ) : (
        <>
          {/* Mobile / tablet: stacked cards */}
          <div className="space-y-4 md:hidden">
            {data.map((studio: Studio) => (
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
                    href={`/studios/${studio._id}`}
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
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-foreground/20 px-4 text-xs font-medium"
                  >
                    <Link href={`/update-studio/${studio._id}`}>Update</Link>
                  </Button>
                  <DeleteStudioDialog id={studio._id}></DeleteStudioDialog>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground font-medium">
                  <th className="py-4 px-6">Studio</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Rate</th>
                  <th className="py-4 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((studio: Studio) => (
                  <tr
                    key={studio._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* Studio Title & Location */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Link href={`/studios/${studio._id}`}>
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

                    {/* Actions (Update & Delete) */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-foreground/20 px-4 text-xs font-medium"
                        >
                          <Link href={`/update-studio/${studio._id}`}>
                            Update
                          </Link>
                        </Button>

                        <DeleteStudioDialog
                          id={studio._id}
                        ></DeleteStudioDialog>
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
