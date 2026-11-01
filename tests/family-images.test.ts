import assert from "node:assert/strict";
import test from "node:test";
import { convertGoogleDriveImageUrl } from "../src/utils/family-helpers";

test("Drive links normalize without changing unrelated image URLs", () => {
  for (const input of [
    "https://drive.google.com/file/d/example_ID-123/view?usp=sharing",
    "https://drive.google.com/open?id=example_ID-123",
    "https://drive.google.com/uc?export=download&id=example_ID-123",
  ]) {
    assert.equal(
      convertGoogleDriveImageUrl(input),
      "https://lh3.googleusercontent.com/d/example_ID-123",
    );
  }
  const external = "https://example.com/photo?id=123";
  assert.equal(convertGoogleDriveImageUrl(external), external);
  assert.equal(convertGoogleDriveImageUrl(`  ${external}  `), external);
  assert.equal(
    convertGoogleDriveImageUrl(
      "https://drive.google.com/drive/folders/folder123",
    ),
    null,
  );
  assert.equal(convertGoogleDriveImageUrl("javascript:alert(1)"), null);
  assert.equal(convertGoogleDriveImageUrl("not a URL"), null);
  assert.equal(convertGoogleDriveImageUrl(""), null);
  assert.equal(convertGoogleDriveImageUrl(null), null);
});
