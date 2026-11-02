import { describe, expect, it } from "vitest";
import { cn, errorMessage } from "./utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });

  it("drops empty values", () => {
    expect(cn("a", null, undefined, "c")).toBe("a c");
  });
});

describe("errorMessage", () => {
  it("returns the message of an Error", () => {
    expect(errorMessage(new Error("boom"))).toBe("boom");
  });

  it("stringifies anything else", () => {
    expect(errorMessage("plain text")).toBe("plain text");
    expect(errorMessage(42)).toBe("42");
  });
});
