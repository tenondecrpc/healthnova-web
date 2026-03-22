import { describe, expect, it } from "vitest";
import { render, screen } from "@/../../tests/test-utils";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("renders 404 message", () => {
    render(<NotFound />);
    expect(screen.getByText("404 — Page not found")).toBeInTheDocument();
  });
});
