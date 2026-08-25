import { z } from 'zod';

export const WeatherDataSchema = z.object({
  temp: z.number(),
  description: z.string(),
  iconUrl: z.string().url(),
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;

export const WeatherApiResponseSchema = z.object({
  main: z.object({
    temp: z.number(),
  }),
  weather: z.array(
    z.object({
      description: z.string(),
      icon: z.string(),
    })
  ),
});

export type WeatherApiResponse = z.infer<typeof WeatherApiResponseSchema>;