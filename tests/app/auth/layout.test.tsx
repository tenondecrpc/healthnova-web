import { describe, expect, it } from "vitest";
import { render, screen } from "@/../../tests/test-utils";
import AuthLayout from "@/app/(auth)/layout";

describe("AuthLayout", () => {
  it("renders children", () => {
    render(
      <AuthLayout>
        <span>login form</span>
      </AuthLayout>,
    );
    expect(screen.getByText("login form")).toBeInTheDocument();
  });
});
