import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-muted text-foreground text-4xl font-bold">
      Welcome to the ATLAS platform
      {/* Add a button to navigate to the dashboard. */}
      <Button
        className="text-lg p-6 hover:text-primary-foreground hover:bg-primary hover:cursor-pointer hover:animate-pulse"
        asChild
      >
        <Link
          href="/dashboard"
          className="text-4xl p-4 hover:text-primary-foreground hover:bg-primary hover:cursor-pointer hover:animate-pulse"
        >
          Dashboard
        </Link>
      </Button>
    </div>
  );
}
