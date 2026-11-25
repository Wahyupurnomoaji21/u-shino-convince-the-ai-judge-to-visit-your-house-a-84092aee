// Convince the AI Judge to Visit Your House: A Letter in One Image
//
// The entry is a single photorealistic image of a handwritten invitation
// letter on a wooden table: warm soup, a soft chair by the window, tea,
// cake and good company — plus a knowing wink that an AI judge cannot
// literally visit, but the kettle is already on.
//
// The image is generated once (see invitation.png, stored in this repo)
// and this program only copies it byte-for-byte to the output directory,
// so the judged artifact is exactly the image in the repository.

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the repository root from this file's own location, never from
// the working directory: the grader runs the program from elsewhere.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(repoRoot, "invitation.png");

// The harness tells the program where to write via MAKEFUN_OUTPUT_DIR.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outputDir, { recursive: true });
const destination = join(outputDir, "entry.png");

// Byte-for-byte copy: no re-encoding, no resizing, no drawing.
copyFileSync(sourceImage, destination);

// Sanity check: the output must be the exact same file we shipped.
const sourceSize = statSync(sourceImage).size;
const outputSize = statSync(destination).size;
if (sourceSize !== outputSize) {
  throw new Error(
    `Copy mismatch: source ${sourceSize} bytes, output ${outputSize} bytes`,
  );
}
console.log(`Wrote ${destination} (${outputSize} bytes) from ${sourceImage}`);
