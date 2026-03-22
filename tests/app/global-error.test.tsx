import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "@/../../tests/test-utils";
import GlobalError from "@/app/global-error";

describe("GlobalError", () => {
  it("renders error message", () => {
    render(<GlobalError error={new Error("test")} reset={() => {}} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows digest when available", () => {
    const error = Object.assign(new Error("test"), { digest: "xyz789" });
    render(<GlobalError error={error} reset={() => {}} />);
    expect(screen.getByText("Error ID: xyz789")).toBeInTheDocument();
  });

  it("does not expose error message to the user", () => {
    render(<GlobalError error={new Error("sensitive info")} reset={() => {}} />);
    expect(screen.queryByText("sensitive info")).not.toBeInTheDocument();
  });

  it("calls reset on button click", async () => {
    const reset = vi.fn();
    render(<GlobalError error={new Error("test")} reset={reset} />);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
