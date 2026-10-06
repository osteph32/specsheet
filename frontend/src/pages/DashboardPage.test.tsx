import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../features/auth/useAuth";
import { DashboardPage } from "./DashboardPage";

vi.mock("../features/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      accessToken: "test-access-token",
      isAuthenticated: true,
      isInitializing: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("welcomes the authenticated user", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Welcome back, testuser",
      }),
    ).toBeInTheDocument();
  });

  it("shows empty dashboard statistics", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Vehicles")).toBeInTheDocument();
    expect(screen.getByText("Maintenance due")).toBeInTheDocument();
    expect(screen.getByText("Active builds")).toBeInTheDocument();
    expect(screen.getByText("Total invested")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Your garage is empty",
      }),
    ).toBeInTheDocument();
  });
});
