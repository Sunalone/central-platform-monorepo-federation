import { describe, expect, it } from "vitest";

describe("__PROJECT_NAME__", () => {
  it("has a generated project name", () => {
    expect("__PROJECT_NAME__").toBeTruthy();
  });
});
