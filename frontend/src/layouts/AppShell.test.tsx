import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../features/auth/useAuth";
import { AppShell } from "./AppShell";

vi.mock("../features/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("AppShell", () => {
  const logout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    logout.mockResolvedValue(undefined);

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
      logout,
    });
  });

  it("displays the authenticated user's account information", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("logs out and navigates to login", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<div>Dashboard content</div>} />
          </Route>

          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /log out/i,
      }),
    );

    expect(logout).toHaveBeenCalledOnce();
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });
});
