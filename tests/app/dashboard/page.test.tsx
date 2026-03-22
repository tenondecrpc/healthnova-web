import { describe, expect, it } from "vitest";
import { render, screen } from "@/../../tests/test-utils";
import DashboardPage from "@/app/(dashboard)/page";

describe("DashboardPage", () => {
  it("renders heading", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
