"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>{error.digest ? `Error ID: ${error.digest}` : "An unexpected error occurred."}</p>
        <button onClick={reset} className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          Try again
        </button>
      </body>
    </html>
  );
}
