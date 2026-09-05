import { Button } from "@/components/ui/button";
import { notfound } from "@/public/locales/en/common.json"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-sm max-md:px-4 pt-20">
      <h1 className="text-8xl md:text-9xl gradient-title">404</h1>
      <div className="h-1 w-16 rounded bg-gradient-to-br from-blue-600 to-blue-400 my-5 md:my-7"></div>
      <p className="text-2xl md:text-3xl font-bold">
        {notfound.heading}
      </p>
      <p className="text-sm md:text-base mt-4 text-muted-foreground max-w-md text-center">
        {notfound.subheading}
      </p>
      <div className="flex items-center gap-4 mt-6">
        <Button 
          size="lg"
          className="px-7 py-5 rounded-md bg-gradient-to-br from-blue-600 to-blue-400"
        >
          <a href="/">
            {notfound.action}
          </a>
        </Button>
      </div>
    </div>
  );
}