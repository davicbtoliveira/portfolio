import { describe, it, expect } from "vitest";
import { readingTime } from "../../src/lib/reading-time";

describe("readingTime", () => {
  it("returns at least one minute for short content", () => {
    expect(readingTime("short post")).toBe("1 min read");
  });

  it("rounds up longer content by word count", () => {
    expect(readingTime(Array.from({ length: 401 }, () => "word").join(" "))).toBe(
      "3 min read",
    );
  });
});
