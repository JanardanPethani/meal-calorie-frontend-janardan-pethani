import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Meal Calorie Counter
      </h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
        Track the calories in your meals quickly and easily using our powerful
        calorie lookup tool powered by the USDA Food Database.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link href="/register">
          <Button size="lg" className="min-w-[150px]">
            Get Started
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline" className="min-w-[150px]">
            Login
          </Button>
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2" />
              <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium">Easy Lookup</h3>
          <p className="mt-2 text-center text-muted-foreground">
            Simply enter the name of any dish and get instant calorie
            information.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 20v-6" />
              <path d="M18 20V10" />
              <path d="M6 20v-3" />
              <path d="M18 4h.01" />
              <path d="M6 4h.01" />
              <path d="M12 4h.01" />
              <path d="M12 14h.01" />
              <path d="M6 10h.01" />
              <rect width="18" height="18" x="3" y="3" rx="2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium">Accurate Data</h3>
          <p className="mt-2 text-center text-muted-foreground">
            Powered by the USDA FoodData Central database for reliable nutrition
            information.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-xl font-medium">Serving Sizes</h3>
          <p className="mt-2 text-center text-muted-foreground">
            Calculate calories for any number of servings to match your meal
            portions.
          </p>
        </div>
      </div>
    </div>
  );
}
