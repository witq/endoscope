const { deduplicateSlashes } = require("./common.js");

describe("common", () => {
  describe("deduplicateSlashes", () => {
    it("should deduplicate double consecutive forward slashes", () => {
      expect(deduplicateSlashes("//hi")).toBe("/hi");
    });
    it("should deduplicate more consecutive forward slashes", () => {
      expect(deduplicateSlashes("///hi")).toBe("/hi");
    });
    it("should leave single slashes as they are", () => {
      expect(deduplicateSlashes("/hi///you")).toBe("/hi/you");
    });
  });
});
