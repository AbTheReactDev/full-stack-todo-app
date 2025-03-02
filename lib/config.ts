import dotenv from "dotenv";

dotenv.config();

// Access environment variables with type safety
export const MONGODB_URI: string = process.env.MONGODB_URI as string;
export const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET as string;

// Validate required variables
const validateEnv = (): void => {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in .env file");
    }
    if (!NEXTAUTH_SECRET) {
        throw new Error("NEXTAUTH_SECRET is not defined in .env file");
    }
};

validateEnv();
