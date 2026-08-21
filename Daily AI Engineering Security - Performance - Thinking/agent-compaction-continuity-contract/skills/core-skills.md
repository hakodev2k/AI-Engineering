# Core Skills

## Skill 1 — Capture Continuity Capsule

**Purpose:** externalize the minimum authoritative task state before compaction, handoff, or context-risk events.

**Trigger:** before compaction; after a major verified decision; after a verified milestone; before handoff; when context usage approaches the configured threshold.

**Inputs:** task ID, active user-turn ID, current goal, constraints, decisions, completed work, failed approaches, open items, blockers, evidence references, current generation.

**Preconditions:** the agent can identify the active task and current turn; artifacts/evidence referenced by state are addressable by stable IDs or paths.

**Required context:** only facts needed to populate the capsule. Hidden chain-of-thought is neither requested nor stored.

**Tools:** file/object store, `scripts/continuity_guard.py`, repository/artifact lookup as needed.

**Procedure:**
1. Read the previous capsule if one exists.
2. Increment `generation` exactly once.
3. Set `active_turn.id` to the current authoritative user-turn/event ID, not copied historical text.
4. Record the goal as an externally verifiable objective.
5. Record non-negotiable constraints separately from descriptive context.
6. Add accepted decisions with evidence reference IDs.
7. Add completed items only when an artifact or verification reference exists.
8. Add failed approaches with a short reason and evidence reference when available.
9. Add unresolved items, blockers, approvals, and the immediate next action.
10. Normalize ordering and compute the canonical checksum with the guard script.
11. Validate the capsule against policy.
12. Persist atomically outside the compactable conversation transcript.

**Decisions:** if a critical field cannot be reconstructed, mark continuity `unknown` and block mutation; do not invent missing state.

**Constraints:** capsule size must remain below policy budget; state must contain conclusions/evidence references, not private reasoning traces; secrets must never be copied into the capsule.

**Expected output:** a validated JSON continuity capsule plus checksum.

**Metrics:** capsule bytes, critical fields populated, evidence-reference coverage, checkpoint age.

**Verification:** `python scripts/continuity_guard.py validate --capsule <file> --policy config/continuity-policy.json` exits 0.

**Failure handling:** one repair attempt for formatting/schema errors; unresolved missing critical state becomes a blocker.

**Stop conditions:** valid capsule persisted, or state classified `unknown` and execution stopped.

---

## Skill 2 — Recover and Validate After Compaction

**Purpose:** prove that execution after compaction continues the same task instead of trusting the compacted narrative.

**Trigger:** immediately after compaction, resume, handoff, model switch, or session reconstruction.

**Inputs:** authoritative pre-compaction capsule, recovered/post-compaction capsule, policy.

**Preconditions:** authoritative capsule checksum is valid.

**Required context:** capsule plus references required to verify discrepancies.

**Tools:** `continuity_guard.py compare`, artifact lookup.

**Procedure:**
1. Validate the authoritative capsule checksum.
2. Construct a recovered capsule from the resumed session without mutating external state.
3. Compare critical fields deterministically.
4. Verify `task_id` and `active_turn.id` first.
5. Compare goal and constraints for unauthorized changes.
6. Confirm every completed item still exists or remains verifiable.
7. Confirm failed approaches remain represented so they are not retried blindly.
8. Confirm blockers/open items have not silently disappeared.
9. Resolve non-critical differences using evidence, never guesswork.
10. If critical differences remain, rehydrate from the authoritative capsule and repeat once.
11. If second comparison fails, stop and escalate.

**Decisions:** critical mismatch = `invalid`; unavailable source capsule = `unknown`; exact/authorized match = `valid`.

**Constraints:** at most two rehydrate attempts; no mutating tools before status `valid`.

**Expected output:** continuity report with status, mismatched fields, and evidence references.

**Metrics:** mismatch count, rehydrate attempts, stale-turn detections, recovery latency.

**Verification:** compare command exits 0 only when critical continuity passes.

**Failure handling:** fail closed and preserve all existing artifacts.

**Stop conditions:** `valid`, or bounded recovery exhausted.

---

## Skill 3 — Detect Repeated Work and Stale-Turn Replay

**Purpose:** prevent compaction-induced repetition of completed work or resurrection of historical instructions.

**Trigger:** before executing the first mutating step after recovery and whenever the proposed next action overlaps prior work.

**Inputs:** active-turn ID, proposed action, completed items, failed approaches, evidence references.

**Preconditions:** continuity status is at least known; if unknown, mutation remains blocked.

**Required context:** structured state only.

**Tools:** continuity capsule and deterministic state lookup.

**Procedure:**
1. Match proposed action against completed item IDs/artifacts.
2. Match proposed hypothesis/approach against failed-approach IDs.
3. Verify the active-turn ID equals the capsule active-turn ID.
4. If repeating completed work, require explicit reason such as regression retest or changed inputs.
5. If retrying a failed approach, require new evidence that invalidates the prior failure reason.
6. If the active turn is stale, stop and rehydrate the current turn before any action.
7. Record legitimate replay reason in the next checkpoint.

**Decisions:** unexplained replay = block; explained retest = allow; stale active turn = block.

**Constraints:** semantic similarity alone cannot authorize mutation; artifacts/IDs provide authority.

**Expected output:** `allow`, `block-repeat`, or `block-stale-turn` with reason.

**Metrics:** repeated-work blocks, stale-turn blocks, justified retests, wasted tool calls avoided.

**Verification:** blocked fixtures must fail before tool invocation.

**Failure handling:** fail closed on ambiguous task/turn identity.

**Stop conditions:** next action is authorized or execution is blocked.
