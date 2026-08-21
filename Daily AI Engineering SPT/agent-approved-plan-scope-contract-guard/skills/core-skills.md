# Core Skills

## Skill 1 — Compile Plan into an Execution Contract
**Purpose:** Convert a human-approved plan into a machine-checkable contract before mutation begins.
**Trigger:** Plan approval or transition from planning to execution.
**Inputs:** Approved plan, repository root, baseline commit/worktree state, project rules.
**Preconditions:** Approval is explicit; plan text is stable; baseline is capturable.
**Required context:** Goal, intended files/components, acceptance criteria, invariants, known out-of-scope areas.
**Tools:** Git status/diff, contract compiler, path matcher, schema validator.
**Procedure:**
1. Capture baseline ref and dirty-state manifest.
2. Extract goal, allowed paths, forbidden paths, operation classes, criteria, invariants, and explicit exclusions.
3. Resolve ambiguous wildcards conservatively; broad root-wide scope requires explicit approval.
4. Serialize canonical JSON, validate schema, compute SHA-256 contract ID.
5. Bind approval event to contract ID/version and baseline.
6. Persist immutable approved contract; execution uses that exact version.
**Decisions:** If scope cannot be represented without ambiguity, stop for a narrower plan rather than silently broadening it.
**Constraints:** Never infer authorization for delete/dependency/network/deploy from a generic “implement” instruction.
**Expected output:** Valid immutable plan contract plus baseline manifest.
**Metrics:** compilation success, ambiguous-scope count, contract coverage of planned files/criteria.
**Verification:** Schema passes; recomputed hash matches; approval record references same hash.
**Failure handling:** Fail closed, preserve plan, emit missing/ambiguous fields.
**Stop conditions:** Contract valid and approved, or unresolved ambiguity blocks execution.

## Skill 2 — Gate Mutating Actions Against Scope
**Purpose:** Prevent silent scope expansion during execution.
**Trigger:** Before any create/edit/delete/rename, dependency change, network mutation, deploy, or shell command capable of mutation.
**Inputs:** Active contract, proposed action, target paths, command metadata.
**Preconditions:** Active contract hash verified.
**Required context:** Current baseline, cumulative changed-file manifest, prior approved amendments.
**Tools:** `scripts/plan_scope_guard.py`, command classifier, Git diff.
**Procedure:**
1. Normalize proposed paths relative to repository root.
2. Classify operation.
3. Compare each target with forbidden then allowed scopes.
4. Evaluate whether action violates an invariant or introduces a new subsystem/dependency/architecture decision.
5. Compute cumulative scope impact, not only the local action.
6. Allow only exact in-contract actions; otherwise produce a deviation request before mutation.
**Decisions:** Cosmetic/generated side effects are not automatically allowed; they require either declared patterns or an amendment.
**Constraints:** Tool-level approval cannot override task-level contract boundaries.
**Expected output:** `ALLOW`, `DENY`, or `AMENDMENT_REQUIRED` with evidence.
**Metrics:** blocked drift attempts, false-positive rate, unclassified mutations.
**Verification:** Adversarial tests show forbidden/out-of-scope actions fail closed.
**Failure handling:** Unknown operation or path -> deny and escalate.
**Stop conditions:** Action allowed, or execution pauses for amendment.

## Skill 3 — Create a Controlled Plan Amendment
**Purpose:** Handle legitimate deviations without turning recovery into scope drift.
**Trigger:** Tool failure, discovered requirement, changed architecture assumption, or necessary adjacent change.
**Inputs:** Active contract, failed attempt evidence, proposed deviation, expected impact.
**Preconditions:** No out-of-contract mutation has occurred.
**Required context:** What failed, why current plan cannot proceed, minimal alternative, added risks/files/operations.
**Tools:** contract compiler, diff estimator.
**Procedure:**
1. Record observed failure separately from interpretation.
2. Generate the smallest viable deviation.
3. Show added/removed paths, operations, acceptance-criterion changes, and risk.
4. Create version N+1 referencing parent contract and reason.
5. Require explicit approval for material amendment.
6. Rebind subsequent actions to the new contract hash.
**Decisions:** Retry current approach only when it remains inside contract and retry budget is available.
**Constraints:** Maximum two execution retries for the same failed mechanism before amendment/escalation.
**Expected output:** Approved amendment or stopped execution.
**Metrics:** amendment frequency, retry-to-amend ratio, post-amend drift rate.
**Verification:** Parent link valid; new hash/approval recorded; old version becomes inactive.
**Failure handling:** No approval -> stop without mutation.
**Stop conditions:** New contract approved or task halted.

## Skill 4 — Verify Plan-to-Result Fidelity
**Purpose:** Prove final implementation matches the approved contract rather than merely “tests pass.”
**Trigger:** Before completion claim.
**Inputs:** Active contract, baseline, final diff, tests/build evidence, execution log.
**Preconditions:** No running mutating subagent/tool remains.
**Required context:** All amendments and cumulative changes.
**Tools:** Git diff/name-status, guard verifier, test commands.
**Procedure:**
1. Diff baseline to final state.
2. Explain every changed path using contract scope or approved amendment.
3. Map each acceptance criterion to concrete evidence.
4. Re-check invariants and forbidden paths.
5. Confirm no unapproved operation class occurred.
6. Classify status as Implemented, Measured, Verified, or Blocked.
**Decisions:** Passing tests do not excuse unexplained out-of-scope changes.
**Constraints:** Implementer cannot be sole verifier for material/high-risk changes.
**Expected output:** Verification report with pass/fail per contract field.
**Metrics:** explained-change ratio, criteria coverage, invariant violations, rework rate.
**Verification:** 100% changed-file explanation and criterion evidence required for Verified.
**Failure handling:** Revert/repair only within contract; otherwise amendment required.
**Stop conditions:** Verified or explicitly Blocked.