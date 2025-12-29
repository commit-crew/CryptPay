import { drizzle } from 'drizzle-orm/neon-http';

export { eq } from "drizzle-orm";
export const db = drizzle(process.env.DATABASE_URL!);