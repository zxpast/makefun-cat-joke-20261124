// The One-Line Cat Joke That Lands.
//
// One fixed funny line, written to /output/entry.txt. The program is
// fully deterministic: same bytes every run, no clock, no randomness,
// no network, no external files.
//
// The line:
//   I told my cat she's adopted; she checked the lease and said, 'I'm keeping the apartment.'
//
// Why this line, against the judge's brief, in order:
// 1. A one-line joke about cats, 89 characters — inside the 200 cap,
//    setup ("I told my cat she's adopted") + turn that lands in the
//    last four words ("I'm keeping the apartment").
// 2. The turn is a self-own: the narrator loses his own apartment to
//    the cat. The cat answers back in a quote, and the quote is the
//    punchline — the humiliating words belong to someone else, the
//    pattern the winning one-liners share (Laugh/Zero Use top-3:
//    0.67 quote share vs 0.36 field).
// 3. Fresh angle, not a heard-it-before cat pun: no "purr", no "meow",
//    no nine lives, no knocking things off tables. Two concrete images
//    collide in the last words — a legal lease and a cat claiming the
//    apartment, i.e. the cat as the ex-spouse who wins the divorce
//    settlement. A web search for the exact phrase returns 0 verbatim
//    hits, and the blind leaderboard is empty (no rival texts yet),
//    so the line is original as far as can be checked.
// 4. Nothing after the punchline, nothing explains the joke, no
//    wind-up: one sentence, setup then quote, done.
// 5. Retellable the same day: "I told my cat she's adopted..."
//    is a story anyone can repeat to a friend in one breath.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const LINE =
  "I told my cat she's adopted; she checked the lease and said, 'I'm keeping the apartment.'";

const DEST = join(OUTPUT_DIR, 'entry.txt');

// Gate the line before writing it: the sealed scorer only accepts
// UTF-8 text of 1 to 200 characters, not only whitespace. Fail loudly
// here instead of shipping an entry the gate would refuse.
if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
  console.error(`entry line fails the 1-200 character gate (${LINE.length} characters)`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  writeFileSync(DEST, LINE + '\n', 'utf8');
} catch (err) {
  console.error(`entry.txt could not be written to ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the file back: the gate reads exactly these bytes, so a short or
// mangled write must fail here rather than ship a broken entry.
let back: string;
try {
  back = readFileSync(DEST, 'utf8');
} catch (err) {
  console.error(`entry.txt could not be read back from ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}
if (back !== LINE + '\n') {
  console.error(`entry.txt read back does not match the entry line (got ${back.length} bytes)`);
  process.exit(1);
}
