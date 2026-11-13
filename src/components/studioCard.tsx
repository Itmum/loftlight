// // components/StudioCard.tsx
// import React from "react";
// import Link from "next/link";
// import { MapPin, Star } from "lucide-react";
// import { Card, CardContent, CardFooter } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import Image from "next/image";
// import { StudioType } from "@/lib/studio";

// interface StudioCardProps {
//   studio: StudioType & { rating?: number };
// }

// export function StudioCard({ studio }: StudioCardProps) {
//   // Fallback image if the studio images array is empty
//   const coverImage = studio.images?.[0] || "/placeholder-studio.jpg";
//   // Fallback rating matching your design screenshot
//   const rating = studio.rating ?? 4.9;

//   return (
//     <Card className="group flex flex-col overflow-hidden rounded-2xl border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md py-0 gap-0">
//       {/* Top Image & Overlaid Badges */}
//       <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
//         <Image
//           src={coverImage}
//           alt={studio.title}
//           className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//         />

//         {/* Category Pill (Top Left) */}
//         <Badge
//           variant="secondary"
//           className="absolute top-3 left-3 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur-xs hover:bg-card"
//         >
//           {studio.category}
//         </Badge>

//         {/* Rating Pill (Top Right) */}
//         <Badge className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-mustard px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs hover:bg-mustard">
//           <Star className="h-3 w-3 fill-foreground text-foreground" />
//           <span>{rating.toFixed(1)}</span>
//         </Badge>
//       </div>

//       {/* Middle Details Section */}
//       <CardContent className="flex flex-1 flex-col justify-between p-5 pb-3">
//         <div>
//           {/* Serif Title matching --font-fraunces */}
//           <h3 className="line-clamp-2 font-serif text-xl font-bold tracking-tight text-card-foreground">
//             {studio.title}
//           </h3>

//           {/* Location */}
//           <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
//             <MapPin className="h-4 w-4 shrink-0 text-primary" />
//             <span className="truncate">{studio.location}</span>
//           </div>
//         </div>

//         {/* Hourly Rate & Capacity Row */}
//         <div className="mt-4 flex items-baseline justify-between">
//           <div className="font-serif text-lg font-bold text-primary">
//             ${studio.hourlyRate}
//             <span className="font-sans text-sm font-normal text-muted-foreground">
//               {" "}
//               / hr
//             </span>
//           </div>
//           <span className="text-sm text-muted-foreground">
//             Up to {studio.capacity}
//           </span>
//         </div>
//       </CardContent>

//       {/* Bottom Action Button */}
//       <CardFooter className="p-5 pt-2">
//         <Button
//           //   asChild
//           variant="outline"
//           className="w-full rounded-full border-foreground/25 bg-transparent font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
//         >
//           <Link href={`/studios/${studio.id}`}>View Details</Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
