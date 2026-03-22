import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "@/../../tests/test-utils";
import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
  it("renders error message", () => {
    render(<ErrorPage error={new Error("test")} reset={() => {}} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows digest when available", () => {
    const error = Object.assign(new Error("test"), { digest: "abc123" });
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByText("Error ID: abc123")).toBeInTheDocument();
  });

  it("shows generic message when no digest", () => {
    render(<ErrorPage error={new Error("test")} reset={() => {}} />);
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });

  it("does not expose error message to the user", () => {
    render(<ErrorPage error={new Error("secret db connection string")} reset={() => {}} />);
    expect(screen.queryByText("secret db connection string")).not.toBeInTheDocument();
  });

  it("calls reset on button click", async () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("test")} reset={reset} />);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
