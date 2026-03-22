import { describe, expect, it } from "vitest";
import { render, screen } from "@/../../tests/test-utils";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole("button", { name: "Default" })).toHaveClass("bg-primary");
  });

  it("applies destructive variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("text-destructive");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border-border");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button", { name: "Secondary" })).toHaveClass("bg-secondary");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button", { name: "Ghost" })).toHaveClass("hover:bg-muted");
  });

  it("applies link variant classes", () => {
    render(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button", { name: "Link" })).toHaveClass("text-primary");
  });

  it("applies sm size classes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: "Small" })).toHaveClass("h-7");
  });

  it("applies lg size classes", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button", { name: "Large" })).toHaveClass("h-9");
  });

  it("applies icon size classes", () => {
    render(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button", { name: "Icon" })).toHaveClass("size-8");
  });

  it("applies custom className", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole("button", { name: "Custom" })).toHaveClass("my-custom-class");
  });

  it("sets data-slot attribute", () => {
    render(<Button>Slot</Button>);
    expect(screen.getByRole("button", { name: "Slot" })).toHaveAttribute("data-slot", "button");
  });
});
