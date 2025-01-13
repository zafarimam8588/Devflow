import { Rocket, Stars, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JobsPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background">
      <div className="relative max-w-2xl mx-auto text-center space-y-8 p-8 rounded-2xl  bg-card dark:bg-card/50">
        {/* Icons with Gradient */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="p-4 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 animate-bounce">
            <Rocket className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 animate-bounce delay-100">
            <Stars className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 animate-bounce delay-200">
            <Sparkles className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-300 dark:via-purple-300 dark:to-indigo-300 text-transparent bg-clip-text">
            Something Amazing Is Coming
          </h1>
          <p className="text-muted-foreground text-lg dark:text-slate-100">
            WeWe&apos;rere crafting a revolutionary jobs platform that will
            transform your career journey. Our team of experts is working around
            the clock to bring you something extraordinary.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto space-y-2 mt-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden dark:bg-muted/20">
            <div
              className="h-full w-[65%] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 animate-pulse"
              role="progressbar"
              aria-valuenow={65}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-sm text-muted-foreground dark:text-slate-100">
            Launch Progress: 65%
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
            <h3 className="font-semibold text-foreground dark:text-slate-100">
              Smart Matching
            </h3>
            <p className="text-sm text-muted-foreground dark:text-slate-100">
              AI-powered job recommendations
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
            <h3 className="font-semibold text-foreground dark:text-slate-100">
              Career Growth
            </h3>
            <p className="text-sm text-muted-foreground dark:text-slate-100">
              Personalized development paths
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
            <h3 className="font-semibold text-foreground dark:text-slate-100">
              Global Network
            </h3>
            <p className="text-sm text-muted-foreground dark:text-slate-100">
              Connect with top employers
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 dark:hover:from-pink-500 dark:hover:via-purple-500 dark:hover:to-indigo-500 text-white border-0"
        >
          <Link href="/">Back to Homepage</Link>
        </Button>

        {/* Launch Info */}
        <p className="text-sm text-muted-foreground pt-8">
          Launching Soon • Stay Tuned for the Future of Job Search
        </p>
      </div>
    </div>
  );
}
