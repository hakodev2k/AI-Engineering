# Hooks

## Hook: pre-compaction-capture
**Trigger:** before manual/automatic compaction when the harness exposes an event, or when context reaches the configured threshold.

**Action:** capture, stamp and validate a new capsule generation.

**Command:**
`python scripts/continuity_guard.py stamp --capsule state/continuity.json && python scripts/continuity_guard.py validate --capsule state/continuity.json --policy config/continuity-policy.json`

**Expected result:** exit 0; checksum valid; critical fields present.

**Failure behavior:** retain prior valid capsule, block controlled compaction/handoff when possible, and mark continuity risk. Never fabricate missing fields.

---

## Hook: post-compaction-gate
**Trigger:** immediately after compaction/resume/handoff and before the first mutating tool call.

**Action:** compare authoritative and recovered capsules.

**Command:**
`python scripts/continuity_guard.py compare --before state/continuity.json --after state/recovered.json --policy config/continuity-policy.json`

**Expected result:** exit 0 and `status=valid`.

**Failure behavior:** perform one bounded rehydrate attempt; if still invalid, block mutation and escalate.

---

## Hook: pre-mutation-continuity-check
**Trigger:** every first mutation after recovery; optionally all high-risk mutations.

**Action:** require a fresh valid comparison receipt and confirm active turn ID/task ID.

**Command:**
`python scripts/continuity_guard.py receipt --before state/continuity.json --after state/recovered.json --policy config/continuity-policy.json --max-age-seconds 300`

**Expected result:** signed-by-hash JSON receipt with status `valid` and current capsule checksums.

**Failure behavior:** fail closed; do not invoke the mutating tool.

---

## Hook: milestone-checkpoint
**Trigger:** after a decision becomes accepted or work is verified complete.

**Action:** update observable state, attach evidence/artifact IDs, increment generation, stamp and validate.

**Expected result:** new valid generation.

**Failure behavior:** keep the prior valid generation and mark the milestone uncommitted until state capture succeeds.

---

## Hook: final-verification
**Trigger:** before declaring a long-running task complete.

**Action:** validate latest capsule and ensure blockers/open items agree with completion claim.

**Expected result:** no unresolved blocking item and all completed items have artifacts/evidence.

**Failure behavior:** completion claim is rejected until discrepancies are resolved.
