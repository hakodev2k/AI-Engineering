# Core Skills

## Skill 1 — Canonical Write Preflight
**Purpose:** prove that an intended mutation resolves to an authorized destination before any write-capable tool runs.

**Trigger:** file edit, overwrite, append, move, copy, archive extraction, generated-file replacement, temp-file promotion, or shell command containing a redirection/write primitive.

**Inputs:** requested path, configured writable roots, operation type, optional shell command.

**Preconditions:** policy file available; filesystem metadata readable; no mutation has occurred yet.

**Required context:** repository root, expected destination, whether the operation intentionally targets a link, risk classification.

**Tools:** `scripts/write_target_guard.py`, OS filesystem metadata, Git status when repository context matters.

**Procedure:**
1. Capture the requested lexical path.
2. Resolve the destination parent canonically.
3. Detect whether the destination leaf is a symlink.
4. Resolve the current canonical target when it exists.
5. Compare canonical parent/target against writable roots.
6. Check protected path fragments.
7. If a shell command is planned, scan it for configured write primitives.
8. Record the preflight result without file contents.
9. Proceed only on `pass`; otherwise redesign the operation or request explicit human approval where policy permits.
10. Re-run preflight immediately before the actual mutation if any meaningful time/tool boundary has passed.

**Decisions:**
- Outside canonical root → block.
- Symlink leaf under default policy → block.
- Resolution uncertainty → fail closed.
- Protected destination → human approval, never silent override.

**Constraints:** do not dereference-and-write as a workaround; do not broaden writable roots simply to make a task pass.

**Expected output:** structured pass/block evidence with requested path, canonical metadata, violations, and preflight duration.

**Metrics:** blocked escape fixtures; false-positive rate; preflight p50/p95; percentage of write operations covered.

**Verification:** independently confirm the final target remains inside an allowed canonical root and that no prohibited link is present.

**Failure handling:** on resolution error, stop mutation; collect path metadata; retry at most once after refreshing filesystem state.

**Stop conditions:** unresolved target identity, outside-root destination, unexpected link, protected target without approval.

## Skill 2 — Safe Atomic Replacement
**Purpose:** replace a normal file without exposing a predictable temp path or following a hostile leaf symlink.

**Trigger:** an agent wants to rewrite an existing file or generate content then promote it into place.

**Inputs:** validated destination, generated content produced by the host/application.

**Preconditions:** canonical preflight passed; destination parent is inside an approved root; host implementation supports exclusive temp creation.

**Procedure:**
1. Create the temporary file exclusively in the validated destination directory using a random OS-provided name.
2. Set restrictive permissions appropriate to the artifact.
3. Write and flush content.
4. Revalidate destination link/canonical state.
5. Atomically replace/rename the temp file to the destination using host APIs that do not intentionally follow a symlink leaf.
6. Verify resulting path identity, file type, and repository diff.
7. Remove temp artifacts on failure.

**Decisions:** if destination becomes a link between checks, abort and preserve evidence; never fall back to shell `>` as a convenience.

**Constraints:** no predictable temp name; no temp directory on another filesystem for atomic promotion; no force flag that bypasses target checks.

**Expected output:** replacement verification containing destination path, operation outcome, and Git diff summary if applicable.

**Metrics:** atomic replacement success rate; race detections; leftover temp files; outside-root writes (target zero).

**Verification:** final destination is a regular expected file under the same canonical parent and only intended bytes/diff changed.

**Failure handling:** delete owned temp file, do not modify destination, escalate link-state changes.

**Stop conditions:** link-state change, cross-filesystem promotion requirement, ownership ambiguity, failed verification.

## Skill 3 — Symlink Incident Triage
**Purpose:** recover safely when a suspected write-through-link event occurs.

**Trigger:** runtime corruption, unexpected target modification, recursive launcher behavior, outside-workspace diff, or guard violation after a write.

**Inputs:** operation log, requested path, canonical path evidence, Git/runtime hashes where available.

**Procedure:**
1. Stop further writes and agent retries.
2. Preserve path metadata and timestamps without copying secrets.
3. Identify requested path, link chain, canonical target, and modified object.
4. Compare target against known-good package/repository state.
5. Restore only through trusted package/repository recovery mechanisms.
6. Run security verification and regression fixture.
7. Document cause and tighten policy before resuming automation.

**Decisions:** runtime/system target modification → treat as security incident; repository-only accidental change → revert only after evidence is captured.

**Constraints:** implementing agent is not sole verifier; no blind reinstall that destroys useful evidence when host safety allows preservation.

**Expected output:** incident record with facts, impact, recovery action, and independent verification.

**Metrics:** time to containment; repeated incident rate; verified restoration rate.

**Stop conditions:** unclear target ownership, privileged recovery needed, evidence of broader host compromise.
