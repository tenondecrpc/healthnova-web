import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/../../tests/test-utils";

const mockPush = vi.fn();
const mockGetCurrentUser = vi.fn();
const mockFetchAuthSession = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@/lib/configAuth", () => ({
  env: {
    NEXT_PUBLIC_COGNITO_REGION: "us-east-1",
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: "pool",
    NEXT_PUBLIC_COGNITO_CLIENT_ID: "client",
    NEXT_PUBLIC_API_URL: "http://localhost:3000/",
  },
}));

import DashboardPage from "@/app/(dashboard)/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("aws-amplify/auth", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
  fetchAuthSession: () => mockFetchAuthSession(),
  signOut: () => mockSignOut(),
}));

global.fetch = vi.fn();

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading initially", () => {
    mockGetCurrentUser.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<DashboardPage />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("fetches and displays dashboard data successfully", async () => {
    const mockData = {
      heartRate: 72,
      caloriesBurned: 450,
      activityMinutes: 30,
      insights: "Great progress today!",
    };

    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({
      tokens: { accessToken: { toString: () => "test-token" } },
    });
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Health Dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("450")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Great progress today!")).toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", async () => {
    mockGetCurrentUser.mockRejectedValue({ name: "UserUnAuthenticatedException" });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to login when no access token", async () => {
    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({ tokens: null });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("displays error when API call fails", async () => {
    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({
      tokens: { accessToken: { toString: () => "test-token" } },
    });
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    });
  });

  it("displays N/A when metrics are missing", async () => {
    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({
      tokens: { accessToken: { toString: () => "test-token" } },
    });
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Health Dashboard")).toBeInTheDocument();
    });

    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBeGreaterThan(0);
  });

  it("handles logout successfully", async () => {
    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({
      tokens: { accessToken: { toString: () => "test-token" } },
    });
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ heartRate: 72 }),
    });
    mockSignOut.mockResolvedValue(undefined);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Sign out")).toBeInTheDocument();
    });

    const signOutButton = screen.getByText("Sign out");
    signOutButton.click();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("handles logout error gracefully", async () => {
    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({
      tokens: { accessToken: { toString: () => "test-token" } },
    });
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ heartRate: 72 }),
    });
    mockSignOut.mockRejectedValue(new Error("Sign out failed"));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Sign out")).toBeInTheDocument();
    });

    const signOutButton = screen.getByText("Sign out");
    signOutButton.click();

    await waitFor(() => {
      expect(screen.getByText("Failed to sign out")).toBeInTheDocument();
    });
  });

  it("displays no insights message when insights are missing", async () => {
    mockGetCurrentUser.mockResolvedValue({ username: "test" });
    mockFetchAuthSession.mockResolvedValue({
      tokens: { accessToken: { toString: () => "test-token" } },
    });
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ heartRate: 72 }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("No significant insights derived yet.")).toBeInTheDocument();
    });
  });
});
