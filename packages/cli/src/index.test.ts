import { describe, expect, it } from "vitest";
import { formatTargetDir } from "./utils";

describe("cli", () => {
  it("normalizes target directory", () => {
    expect(formatTargetDir("demo///")).toBe("demo");
  });
});
