import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

vi.mock("./hooks/useHealth", () => ({
  useHealth: () => ({
    data: {
      status: "ok",
      service: "specsheet-api",
    },
    isLoading: false,
    isError: false,
  }),
}));

describe("App", () => {
  it("renders the SpecSheet heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "SpecSheet" }),
    ).toBeInTheDocument();
  });

  it("shows the connected backend service", () => {
    render(<App />);

    expect(screen.getByText("Connected to specsheet-api")).toBeInTheDocument();
  });
});
