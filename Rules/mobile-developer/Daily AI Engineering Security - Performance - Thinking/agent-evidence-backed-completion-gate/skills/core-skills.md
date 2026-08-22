# Core Skills

## Skill 1 — Normalize Requirements into a Verification Contract

**Purpose:** turn prose requirements into durable acceptance items before implementation begins.

**Trigger:** any task whose final result may be represented as complete, fixed, implemented, deployed, migrated, or verified.

**Inputs:** user request, repository constraints, explicit acceptance criteria, safety constraints.

**Preconditions:** the task scope is available; no destructive operation is required merely to discover requirements.

**Required context:** current request, relevant repository instructions, known test/build commands.

**Tools:** file/repository inspection, issue/task metadata, deterministic JSON writer.

**Procedure:**
1. Extract every material outcome, including negative requirements such as “do not change X”.
2. Assign stable IDs (`REQ-001`, `REQ-002`, ...).
3. Mark each requirement mandatory or optional.
4. Define expected observable evidence for each item: test, command, inspection, artifact, or explicit external observation.
5. Identify broad regression requirements separately from focused behavior checks.
6. Record unknowns as uncertainty; do not silently convert assumptions into requirements.
7. Persist the contract before implementation or as soon as new requirements become known.

**Decisions:** split a requirement when different parts need independent verification; merge only when one observation proves the whole item.

**Constraints:** never request hidden chain-of-thought; record only explicit facts, assumptions, evidence needs, and decisions.

**Expected output:** requirement ledger with IDs, text, mandatory flag, expected evidence class, and covered paths if known.

**Metrics:** requirement coverage ratio; number of unclassified requirements.

**Verification:** every material user outcome maps to one ledger entry and every mandatory entry names an observable completion condition.

**Failure handling:** when a requirement is ambiguous, mark it `unknown` with the ambiguity; in non-interactive runs choose the safest reasonable interpretation and retain the uncertainty.

**Stop conditions:** all material outcomes are represented or the task is blocked by irreducible ambiguity.

## Skill 2 — Capture Evidence at Source

**Purpose:** avoid reconstructing proof from memory or prose at task end.

**Trigger:** each validation command, test run, artifact creation, file inspection, or external status check.

**Inputs:** requirement IDs, command/tool event, result, affected paths, timestamp.

**Preconditions:** evidence comes from an actual observation rather than a model assertion.

**Required context:** requirement ledger and current repository state.

**Tools:** shell/test runner, file inspection, CI status, artifact metadata, `scripts/evidence_probe.py`.

**Procedure:**
1. Execute or observe the validation action.
2. Record command/tool identity, exit status where applicable, concise result, scope, timestamp, and paths.
3. Attach evidence to one or more requirement IDs.
4. Label focused versus full/regression scope explicitly.
5. Record failed, skipped, cancelled, unavailable, and partial checks rather than dropping them.
6. Never transform a code change alone into verified behavior.

**Decisions:** command evidence is successful only when policy accepts its exit status; inspection evidence may verify static requirements but must not masquerade as runtime proof.

**Constraints:** do not store secrets; redact sensitive command output while preserving result semantics.

**Expected output:** append-only observable evidence entries.

**Metrics:** fresh evidence per mandatory requirement; percentage of verification claims tied to observed events.

**Verification:** each `verified` candidate has at least one policy-allowed fresh evidence item.

**Failure handling:** if a command cannot run, preserve the reason and downgrade status; never infer pass.

**Stop conditions:** requested check completes, fails, is unavailable, or reaches its explicit timeout.

## Skill 3 — Invalidate Stale Evidence

**Purpose:** prevent tests run before later edits from proving the final code state.

**Trigger:** any file or dependency change after evidence capture.

**Inputs:** changed paths, evidence path coverage, timestamps, dependency relationships if available.

**Preconditions:** path/change information is available.

**Required context:** evidence ledger and post-evidence diff.

**Tools:** git diff/status, build graph metadata, deterministic completion gate.

**Procedure:**
1. Compute paths changed after each evidence observation.
2. Compare changed paths with evidence-covered paths.
3. Mark overlapping evidence stale.
4. When dependency impact is known, invalidate downstream evidence as well.
5. Require re-verification before restoring `verified`.

**Decisions:** when dependency impact is uncertain, prefer `partially_verified` and record uncertainty rather than silently preserving freshness.

**Constraints:** evidence freshness must be machine-checkable where possible.

**Expected output:** updated `fresh` flags and reasons for invalidation.

**Metrics:** stale evidence accepted count; revalidation rate after post-test changes.

**Verification:** a fixture where a covered file changes after a passing test cannot pass the completion gate.

**Failure handling:** unknown change provenance causes conservative downgrade.

**Stop conditions:** all evidence has an explicit freshness state.

## Skill 4 — Gate Completion Deterministically

**Purpose:** separate process success, implementation progress, and semantic task completion.

**Trigger:** before a final completion response, PR-ready signal, ticket closure, downstream deployment, or parent-agent handoff.

**Inputs:** evidence ledger, policy, run-state metadata.

**Preconditions:** requirement contract exists.

**Required context:** mandatory/optional requirements, evidence freshness, loop terminal state, remediation count.

**Tools:** `scripts/completion_gate.py`.

**Procedure:**
1. Validate ledger structure and unique requirement IDs.
2. Reject terminal success when agent loop state indicates pending `tool_use` or equivalent nonterminal state.
3. For every mandatory requirement, validate status and fresh observable evidence.
4. Reject `verified` status supported only by claims/diffs or failed commands.
5. Invalidate stale evidence against changed paths.
6. Produce deterministic verdict and blocking reasons.
7. If incomplete and remediation budget remains, hand only blocking items to the implementation/test agent.
8. After bounded retries, stop and surface incomplete/blocked status.

**Decisions:** `complete` requires all mandatory requirements verified; optional work may remain partially verified according to policy.

**Constraints:** no unlimited retries; implementing agent is not the sole verifier for high-impact tasks.

**Expected output:** machine-readable verdict plus concise evidence-backed completion record.

**Metrics:** false-complete rate, false-block rate, retries/task, evidence coverage, stale-evidence rejection count.

**Verification:** contract tests cover unsupported claims, mid-tool termination, failed commands, stale evidence, missing mandatory items, and known-good completion.

**Failure handling:** schema/integrity errors fail closed as `invalid`.

**Stop conditions:** `complete`, explicit `blocked`, or remediation retry budget exhausted.
