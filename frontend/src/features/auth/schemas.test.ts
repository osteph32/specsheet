import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "./schemas";

describe("loginSchema", () => {
  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "strongpassword123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty credentials", () => {
    const result = loginSchema.safeParse({
      username: "",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts a valid registration", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "strongpassword123",
      confirmPassword: "strongpassword123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "strongpassword123",
      confirmPassword: "differentpassword123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "not-an-email",
      password: "strongpassword123",
      confirmPassword: "strongpassword123",
    });

    expect(result.success).toBe(false);
  });
});
