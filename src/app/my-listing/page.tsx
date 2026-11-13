import { StudioCard } from "@/components/studio-card";
import { Button } from "@/components/ui/button";
import { Studio } from "@/lib/studio";
import { ExternalLink, Link2, Plus } from "lucide-react";
import Link from "next/link";

export default async function MyListingsPage() {
  const res = await fetch("http://localhost:8000/all-studios");
  const data = await res.json();
  console.log(data);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header section with title and Add studio button */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My studio listings
        </h1>
        <Button className="rounded-full bg-[#a34739] w-48 px-2 py-2 font-medium text-white hover:bg-[#a34739]/90">
          <Link href="/add-studio" className="flex justify-center items-center">
            <Plus className="mr-1.5 size-4" /> Add studio
          </Link>
        </Button>
      </div>

      {/* Table Container wrapped in a card box */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
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
              data.map((studio: Studio) => (
                <tr
                  key={studio._id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Studio Title & Location */}
                  <td className="py-4 px-6 flex items-center gap-3">
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

                      <Button
                        size="sm"
                        className="rounded-full bg-[#a34739] px-4 text-xs font-medium text-white hover:bg-[#a34739]/90"
                      >
                        Delete
                      </Button>
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
