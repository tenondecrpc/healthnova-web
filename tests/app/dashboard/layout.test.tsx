import { describe, expect, it } from "vitest";
import { render, screen } from "@/../../tests/test-utils";
import DashboardLayout from "@/app/(dashboard)/layout";

describe("DashboardLayout", () => {
  it("renders children", () => {
    render(
      <DashboardLayout>
        <span>content</span>
      </DashboardLayout>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
