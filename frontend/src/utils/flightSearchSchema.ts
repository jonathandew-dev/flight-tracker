import { z } from "zod";

export const flightSearchSchema = z.object({
  origin: z.string().min(3, "Origin is required"),
  destination: z.string().min(3, "Destination is required"),
  departureDate: z
    .string()
    .refine(date => new Date(date) >= new Date(), {
      message: "Departure date must be today or later",
    }),
  returnDate: z.string().optional(),
  adults: z.number().min(1),
  maxResults: z.number().min(1).max(50),
}).superRefine((data, ctx) => {
  if (data.returnDate && new Date(data.returnDate) < new Date(data.departureDate)) {
    ctx.addIssue({
      path: ["returnDate"],
      code: z.ZodIssueCode.custom,
      message: "Return date must be after departure",
    });
  }
});

export type FlightSearchFormData = z.infer<typeof flightSearchSchema>;

