"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Studio, StudioData } from "@/lib/studio";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];
const AMENITIES = [
  "Wi-Fi",
  "Natural light",
  "Green room",
  "Parking",
  "Soundproofing",
  "Lighting kit",
  "Coffee bar",
  "Backdrops",
];
const MAX_IMAGES = 5;

type Errors = Record<string, string | undefined>;

const EMPTY: StudioData = {
  title: "",
  category: "",
  hourlyRate: "",
  deposit: "",
  capacity: "",
  location: "",
  images: [""],
  amenities: [],
  overview: "",
};

// Turns the studio from the database into the shape our form uses.
const toFormData = (s: Studio): StudioData => ({
  title: s.title,
  category: s.category,
  hourlyRate: s.hourlyRate,
  deposit: s.deposit,
  capacity: s.capacity,
  location: s.location,
  images: s.images?.length ? [...s.images] : [""],
  amenities: [...(s.amenities ?? [])],
  overview: s.overview,
});

const isHttpUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// Returns an object like { title: "…", capacity: "…" }. Empty object = valid.
function validate(form: StudioData): Errors {
  const e: Errors = {};

  const title = form.title.trim();
  if (!title) e.title = "Add a studio title.";
  else if (title.length < 3) e.title = "Title must be at least 3 characters.";
  else if (title.length > 80) e.title = "Title must be 80 characters or fewer.";

  if (!form.category) e.category = "Choose a category.";

  const rate = Number(form.hourlyRate);
  if (form.hourlyRate === "") e.hourlyRate = "Enter an hourly rate.";
  else if (!(rate > 0)) e.hourlyRate = "Hourly rate must be more than $0.";
  else if (rate > 10000)
    e.hourlyRate = "Hourly rate can’t be more than $10,000.";

  if (form.deposit !== "" && Number(form.deposit) < 0)
    e.deposit = "Deposit can’t be negative.";

  const cap = Number(form.capacity);
  if (form.capacity === "") e.capacity = "Enter the maximum capacity.";
  else if (!Number.isInteger(cap) || cap < 1)
    e.capacity = "Capacity must be a whole number, 1 or more.";
  else if (cap > 1000) e.capacity = "Capacity can’t be more than 1,000.";

  if (form.location.trim().length < 5)
    e.location = "Enter the studio’s address (at least 5 characters).";

  const filled = form.images.map((u) => u.trim()).filter(Boolean);
  if (filled.length === 0) e.images = "Add at least one image URL.";
  else {
    const bad = filled.findIndex((u) => !isHttpUrl(u));
    if (bad !== -1)
      e.images = `Image ${bad + 1} isn’t a valid link. It should start with https://`;
    else if (new Set(filled).size !== filled.length)
      e.images = "Each image URL must be different.";
  }

  if (form.amenities.length === 0) e.amenities = "Pick at least one amenity.";

  const overview = form.overview.trim();
  if (overview.length < 20)
    e.overview =
      "Write at least 20 characters so creators know what to expect.";
  else if (overview.length > 1000)
    e.overview = "Overview must be 1,000 characters or fewer.";

  return e;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null;

const UpdateStudioPage = ({ params }: { params: Promise<{ id: string }> }) => {
  // In a client page, `use(params)` gives you the id from the URL.
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState<StudioData>(EMPTY);
  // A copy of the studio as it was when the page loaded (to detect "no changes")
  const [initialForm, setInitialForm] = useState<StudioData | null>(null);
  const [host, setHost] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [loadState, setLoadState] = useState<
    "loading" | "ready" | "notfound" | "error"
  >("loading");

  // ----- load the studio and fill the form -----
  useEffect(() => {
    let cancelled = false;

    async function loadStudio() {
      try {
        const res = await fetch(`${API_URL}/all-studios/${id}`, {
          cache: "no-store",
        });
        if (res.status === 404 || res.status === 400) {
          if (!cancelled) setLoadState("notfound");
          return;
        }
        if (!res.ok) throw new Error("Request failed");

        const studio: Studio | null = await res.json();
        if (cancelled) return;
        if (!studio) {
          setLoadState("notfound");
          return;
        }

        const data = toFormData(studio);
        setForm(data);
        setInitialForm(data);
        setHost({
          name: studio.ownerName ?? "",
          email: studio.ownerEmail ?? "",
        });
        setLoadState("ready");
      } catch {
        if (!cancelled) {
          setLoadState("error");
          toast.error("Couldn’t load this studio. Please try again.");
        }
      }
    }

    loadStudio();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Updates one field and clears that field's error message.
  const set = <K extends keyof StudioData>(key: K, value: StudioData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // ----- multiple images -----
  const setImage = (i: number, url: string) =>
    set(
      "images",
      form.images.map((v, idx) => (idx === i ? url : v)),
    );
  const addImage = () =>
    form.images.length < MAX_IMAGES && set("images", [...form.images, ""]);
  const removeImage = (i: number) =>
    set(
      "images",
      form.images.filter((_, idx) => idx !== i),
    );

  // ----- amenities -----
  const toggleAmenity = (name: string, on: boolean) =>
    set(
      "amenities",
      on ? [...form.amenities, name] : form.amenities.filter((a) => a !== name),
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    const found = validate(form);
    setErrors(found);
    const messages = Object.values(found).filter(Boolean) as string[];
    if (messages.length > 0) {
      toast.error(
        messages.length === 1
          ? messages[0]
          : `${messages[0]} (${messages.length - 1} more to fix)`,
      );
      return;
    }

    // Nothing changed? Don't bother the server.
    if (initialForm && JSON.stringify(form) === JSON.stringify(initialForm)) {
      toast.info("You haven’t changed anything yet.");
      return;
    }

    // Send clean data only. The owner is not sent: it never changes on update.
    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      deposit: Number(form.deposit) || 0,
      capacity: Number(form.capacity),
      location: form.location.trim(),
      images: [...new Set(form.images.map((u) => u.trim()).filter(Boolean))],
      amenities: form.amenities,
      overview: form.overview.trim(),
    };

    setSaving(true);
    const toastId = toast.loading("Saving your changes…");
    try {
      let res: Response;
      try {
        res = await fetch(`${API_URL}/all-studios/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // turn on later for the HTTPOnly JWT cookie
          body: JSON.stringify(payload),
        });
      } catch {
        throw new Error(
          "Can’t reach the server. Check your connection and try again.",
        );
      }

      if (res.status === 401)
        throw new Error("Your session expired. Please log in again.");
      if (res.status === 404) throw new Error("This studio no longer exists.");
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ?? "Couldn’t update the studio. Please try again.",
        );
      }

      toast.success("Studio updated.", { id: toastId });
      router.push("/my-listing"); // comment this line out if the page isn't built yet
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong.",
        { id: toastId },
      );
    } finally {
      setSaving(false);
    }
  }

  // ----- what to show while loading, or if loading failed -----
  if (loadState === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading studio…
      </div>
    );
  }

  if (loadState === "notfound" || loadState === "error") {
    return (
      <Card className="mx-auto w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            {loadState === "notfound"
              ? "We can’t find that studio"
              : "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {loadState === "notfound"
              ? "It may have been deleted, or the link is wrong."
              : "We couldn’t load this studio. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/my-listing")}>
            Back to my listings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="font-serif text-3xl">Update studio</CardTitle>
        <CardDescription>
          Change anything below, then save. Creators will see the new details
          right away.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* noValidate: our own validation shows the messages, not the browser's popups */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. The Cyc Wall Loft"
              value={form.title}
              aria-invalid={!!errors.title}
              onChange={(e) => set("title", e.target.value)}
            />
            <FieldError message={errors.title} />
          </div>

          {/* Category + capacity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => {
                  if (v !== null) set("category", v);
                }}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.category} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Max capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                step={1}
                value={form.capacity}
                aria-invalid={!!errors.capacity}
                onChange={(e) =>
                  set(
                    "capacity",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
              <FieldError message={errors.capacity} />
            </div>
          </div>

          {/* Prices */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate">Hourly rate ($)</Label>
              <Input
                id="rate"
                type="number"
                min={0}
                value={form.hourlyRate}
                aria-invalid={!!errors.hourlyRate}
                onChange={(e) =>
                  set(
                    "hourlyRate",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
              <FieldError message={errors.hourlyRate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Security deposit ($)</Label>
              <Input
                id="deposit"
                type="number"
                min={0}
                placeholder="0"
                value={form.deposit}
                aria-invalid={!!errors.deposit}
                onChange={(e) =>
                  set(
                    "deposit",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
              <FieldError message={errors.deposit} />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location / address</Label>
            <Input
              id="location"
              placeholder="Street, area, city"
              value={form.location}
              aria-invalid={!!errors.location}
              onChange={(e) => set("location", e.target.value)}
            />
            <FieldError message={errors.location} />
          </div>

          {/* Multiple images */}
          <div className="space-y-3">
            <div>
              <Label>Images</Label>
              <p className="text-sm text-muted-foreground">
                The first image is your cover photo. Add up to {MAX_IMAGES}.
              </p>
            </div>
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {url.trim() && (
                    // key={url} makes React re-create the <img> when the URL changes,
                    // so a previously hidden broken image gets a fresh try.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt=""
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <Input
                  placeholder="https://i.ibb.co/…"
                  value={url}
                  aria-invalid={!!errors.images}
                  onChange={(e) => setImage(i, e.target.value)}
                />
                {form.images.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(i)}
                    aria-label={`Remove image ${i + 1}`}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <FieldError message={errors.images} />
            {form.images.length < MAX_IMAGES && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
              >
                <Plus className="size-4" /> Add another image
              </Button>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {AMENITIES.map((a) => (
                <label
                  key={a}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={form.amenities.includes(a)}
                    onCheckedChange={(v) => toggleAmenity(a, v === true)}
                  />
                  {a}
                </label>
              ))}
            </div>
            <FieldError message={errors.amenities} />
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <Label htmlFor="overview">Detailed overview</Label>
            <Textarea
              id="overview"
              rows={5}
              placeholder="Describe the space, the best uses, house rules…"
              value={form.overview}
              aria-invalid={!!errors.overview}
              onChange={(e) => set("overview", e.target.value)}
            />
            <div className="flex justify-between">
              <FieldError message={errors.overview} />
              <p className="ml-auto text-xs text-muted-foreground">
                {form.overview.trim().length} / 1000
              </p>
            </div>
          </div>

          {/* Read-only host info (from the saved studio) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="host-name">Host name</Label>
              <Input
                id="host-name"
                value={host.name}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="host-email">Host email</Label>
              <Input
                id="host-email"
                value={host.email}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              size="lg"
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={saving}
              className="w-full sm:w-auto"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateStudioPage;
