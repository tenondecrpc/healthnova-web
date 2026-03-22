"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        {error.digest ? `Error ID: ${error.digest}` : "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
