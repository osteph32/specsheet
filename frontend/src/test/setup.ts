import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Reset the DOM after every test so rendered components cannot leak
// state or markup into subsequent test cases.
afterEach(() => {
  cleanup();
});
