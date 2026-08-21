# Workflow: Observe → Threat-model → Guard → Verify

## Trigger
New/changed host-side file operation, sandbox boundary crossing, worktree/temp-file handling, or observed symlink/path confusion.

## Goal
Guarantee that an authorized pathname cannot be redirected into an unauthorized filesystem object.

## Inputs
Requested paths, approved roots, operation class, caller privilege, platform, symlink exception policy, and regression fixtures.

## Baseline
Run current behavior against safe and adversarial fixtures. Record which paths are allowed, blocked, and whether any unauthorized target is touched.

## Context
Use only path metadata and sanitized logs; do not read external secret contents for test evidence.

## Stages
1. **Observe** — reproduce the unsafe or ambiguous path behavior with an inert marker file.
2. **Measure baseline** — count malicious fixtures reaching outside-root targets and legitimate fixtures falsely blocked.
3. **Threat-model** — use `skills/path-target-threat-model.md` to map path control and privilege boundaries.
4. **Form hypothesis** — identify whether the failure is lexical containment, symlink component following, predictable temp path, worktree confusion, or TOCTOU.
5. **Implement improvement** — add root-aware component validation plus secure open/activation semantics appropriate to the platform.
6. **Measure again** — rerun the exact fixture matrix.
7. **Improved?** — if any unauthorized target remains reachable, perform at most one additional remediation cycle.
8. **Verify** — `subagents/path-boundary-verifier.md` independently reviews code, fixtures, and residual risks.

## Responsible agent
Implementation owner for stages 1–7; independent Path Boundary Verifier for stage 8.

## Tools
`lstat`/realpath APIs, `scripts/path_target_guard.py`, unit/integration tests, sandbox test harness.

## Outputs
Baseline matrix, threat model, guard decisions, before/after results, verifier decision.

## Checkpoints
- No high-risk implementation before approved roots and operation classes are explicit.
- No external-target fixture may contain real secrets.
- No completion with an unresolved TOCTOU window for privileged executable/config writes.
- Human approval is required before a dangerous exception.

## Metrics
Malicious fixtures blocked, legitimate fixtures allowed, privileged operations covered, unguarded operations remaining, false-positive rate.

## Retry policy
Maximum two remediation cycles. A second cycle must address a specifically observed remaining attack path.

## Stop conditions
Stop if secure filesystem primitives required by the threat model are unavailable, the target changes repeatedly during verification, or the only proposed fix weakens sandbox permissions.

## Failure path
Fail closed for the affected high-risk operation, preserve sanitized metadata, and escalate for platform-specific secure-open design or human-approved exception.

## Verification
All attack fixtures blocked, safe fixtures pass, unauthorized targets remain untouched, and independent verifier returns PASS.

## Definition of Done
Evidence documented; baseline captured; trust boundary mapped; guard implemented; tests pass; no attack fixture escapes approved roots; safe workflows remain functional; risky exceptions are explicit; independent verification passes.