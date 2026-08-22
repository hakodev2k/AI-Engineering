# Hooks

## Hook 1 — Pre-Compaction Capture
**Trigger:** before automatic/manual compaction replaces model-visible history.

**Action:** generate the next operational checkpoint from current authoritative state, then validate it.

**Command:** `python scripts/context_checkpoint_guard.py .agent-state/checkpoint.json --policy config/policy.json`

**Expected result:** exit 0 and a checkpoint generation newer than the previously accepted checkpoint.

**Failure behavior:** cancel/defer compaction when the host permits it; repair at most twice. If still invalid, stop task mutation and mark continuity blocked.

## Hook 2 — Post-Compaction Resume Gate
**Trigger:** first execution turn after compaction or restored session handoff.

**Action:** load latest checkpoint, rehydrate required fields, resolve active resource handles, compare repository/test/task state, rerun validator.

**Command:** `python scripts/context_checkpoint_guard.py .agent-state/checkpoint.json --policy config/policy.json --json`

**Expected result:** structural PASS plus zero blocking reconciliation discrepancies.

**Failure behavior:** do not let the execution agent mutate state. Allow one targeted authoritative reconstruction pass; then stop.

## Hook 3 — Before High-Risk/Irreversible Action
**Trigger:** deploy, merge, delete, production write, permission change, external send, destructive migration, credential/identity action.

**Action:** verify objective/constraint continuity and confirm any required approval is still present and unconsumed in `control.pending_approvals` or the authoritative approval system.

**Expected result:** current action is inside verified task scope and required approval is valid.

**Failure behavior:** block the action. Compaction must never manufacture, reset, or imply approval.

## Hook 4 — After Test or Tool Milestone
**Trigger:** a significant test suite, benchmark, migration, scan, or external operation completes.

**Action:** update checkpoint candidate with operation ID, outcome, concise evidence pointer, and resulting next action. Avoid copying large logs.

**Expected result:** future compaction can resume without repeating the operation merely to rediscover its result.

**Failure behavior:** if the result cannot be durably referenced, mark it unverified rather than complete.

## Hook 5 — Final Verification
**Trigger:** before claiming task completion.

**Action:** compare latest checkpoint objective/constraints against actual final files/artifacts/tests and verify no failure, assumption, pending approval, or unknown active resource invalidates completion.

**Expected result:** explicit `Implemented`, `Measured`, and `Verified` statuses.

**Failure behavior:** return the task to the appropriate stage; never hide a continuity gap by loosening completion criteria.
