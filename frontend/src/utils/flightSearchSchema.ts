import { z } from "zod";

export const flightSearchSchema = z
  .object({
    origin: z.string().min(3, "Origin is required"),
    destination: z.string().min(3, "Destination is required"),

    departureDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),

    returnDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
      .optional(),

    adults: z.number().min(1, "At least 1 adult required").max(10),
    maxResults: z.number().min(1).max(50),
  })
  .superRefine((data, ctx) => {
    if (data.returnDate && data.returnDate < data.departureDate) {
      ctx.addIssue({
        path: ["returnDate"],
        message: "Return date must be after departure date",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type FlightSearchFormData = z.infer<typeof flightSearchSchema>;
