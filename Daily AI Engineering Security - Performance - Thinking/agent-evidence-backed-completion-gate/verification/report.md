# Verification Report

## Status dimensions

### Implemented
- Requirement contract procedure is defined.
- Observable evidence capture is implemented with an atomic standard-library Python script.
- Deterministic completion gating is implemented with explicit exit codes.
- Mid-tool/process-success mismatch is checked.
- Mandatory requirement verification is checked.
- Policy-allowed evidence types and accepted command exit codes are enforced.
- Stale evidence invalidation by covered-path overlap is implemented.
- Bounded remediation rules are defined.
- Independent verification role is separated from implementation for high-risk work.
- Contract tests cover known-good completion, implementation-without-verification, claim-only evidence, failed tests, stale evidence, process exit 0 while nonterminal, duplicate IDs, optional requirements, and freshness invalidation.

### Measured
The package defines measurable operational metrics rather than claiming unmeasured production improvement:
- mandatory evidence coverage;
- unsupported verified claims rejected;
- stale evidence invalidated;
- exit-0/nonterminal false-success interceptions;
- retries per task;
- false-block review rate.

No production baseline is fabricated. Teams must collect pre/post task data in their own harness before claiming a reduction in false completion or rework.

### Verified during package review
- Category is Thinking and is distinct from existing loop-progress, worktree-isolation, token, and security packages.
- Public evidence contains multiple independent 2026 signals from Codex and Claude Code.
- Evidence, interpretation, and proposed solution are separated in `evidence/research.md`.
- No hidden chain-of-thought is required or stored.
- Completion does not depend on model confidence or self-assertion.
- Failure paths retain failed/skipped/stale evidence.
- Retry loops are bounded.
- The scripts use safe local file operations and do not perform destructive repository or production actions.
- No credentials or secrets are embedded.

## Contract test expectations
Run:

```bash
python -m unittest tests/test_completion_gate.py
```

Expected: 9 tests pass.

The fixture set proves the following deterministic properties:
1. Fresh passing test evidence can satisfy a mandatory verified requirement.
2. `implemented` cannot masquerade as `verified`.
3. Claim-only evidence cannot prove verification.
4. Failed command/test evidence cannot prove verification.
5. Stale evidence cannot prove verification.
6. Process exit 0 with a nonterminal loop cannot yield semantic completion.
7. Duplicate requirement IDs fail closed.
8. Optional incomplete work does not block when policy allows it.
9. A covered-path change invalidates prior evidence and downgrades status.

## Production verification procedure
Before enabling enforcement for a real agent workflow:
1. Collect a sample of historical agent tasks and manually label true/false completion.
2. Replay their requirement/evidence records through the gate.
3. Measure false-complete and false-block rates.
4. Tune only evidence classifications and optional-policy behavior; do not weaken mandatory fresh-evidence or terminal-state invariants.
5. Enable warn-only mode in the host integration if available.
6. Compare unsupported completion claims and manual rework before/after.
7. Move to blocking mode only when false-block rate is acceptable.

## Definition of Done for an integrated task
A task is done only when:
- all material requirements are in the ledger;
- every mandatory requirement is `verified`;
- each verified mandatory item has fresh allowed observable evidence;
- relevant post-test changes have been considered;
- agent loop state is terminal;
- deterministic gate returns `complete` / exit 0;
- no blocking reason remains;
- retry budget has not been exceeded;
- required human approvals for dangerous validation/actions are recorded outside the model.

## Known scope boundaries
- Path-overlap freshness invalidation is conservative and does not infer arbitrary dependency graphs. Hosts should supply downstream impacted paths when they have build/dependency knowledge.
- The package verifies the evidence contract; it does not prove that an external test suite itself is logically complete.
- Static inspection is valid only for acceptance criteria that can actually be established statically.
- Human review remains appropriate for ambiguous product requirements and irreversible actions.
