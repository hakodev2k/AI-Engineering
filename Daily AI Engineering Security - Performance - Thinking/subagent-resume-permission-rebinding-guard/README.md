# Subagent Resume Permission Rebinding Guard

**Category:** Security

## Problem
Reusable child-agent sessions can cross a security-sensitive lifecycle boundary when they are resumed, followed up, or retargeted. Public 2026 reports show both failure directions: a child can unexpectedly reset from the intended parent permission mode to restrictive defaults, or it can retain stale permissions from a previous subagent role. Either state means the selected role, parent contract, and effective authorization disagree.

## Evidence
See `evidence/research.md`. Current signals include OpenAI Codex issue #40278 (2026-08-23) and OpenCode issue #41681 (2026-08-11), plus documented subagent inheritance behavior in Qwen Code.

## Existing approach
Agent runtimes commonly resolve child permissions at initial spawn from parent mode, role configuration, sandbox defaults, and approval policy, then persist the child session for reuse.

## Existing limitations
Spawn-time checks do not prove later turns preserve the intended contract. Blind persistence can keep stale role permissions; blind recomputation can replace intentional settings with defaults. UI-visible mode names are insufficient evidence of action-time authorization.

## Proposed improvement
Treat every child lifecycle transition as an authorization rebinding event. Build an expected permission envelope from authoritative parent/role/override inputs, capture the effective resumed-turn policy before tools execute, and compare them deterministically. Block unapproved broadening and surface restrictive/stale drift before work proceeds.

## Architecture
```text
subagent-resume-permission-rebinding-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-tool-permission-transition-check.md
├── rules/
│   └── permission-rebinding-rules.md
├── scripts/
│   └── permission_rebinding_guard.py
├── skills/
│   └── permission-transition-audit.md
├── subagents/
│   └── permission-verifier.md
├── tests/
│   └── test_permission_rebinding_guard.py
└── workflows/
    └── resume-transition-verification.md
```

## Installation
Requires Python 3.10+ and no third-party Python packages. Copy this directory intact into the host project or agent-control repository.

## Configuration
Edit `config/policy.json` only to match the host's canonical permission fields/order. The sample ordering treats `read-only < workspace-write < full-access` and `always < on-request < never` as increasing execution autonomy. If a platform has different semantics, map them explicitly; do not guess.

## Usage
Prepare authoritative `expected.json` and runtime-observed `effective.json`, then run:

```bash
python scripts/permission_rebinding_guard.py \
  --expected expected.json \
  --effective effective.json \
  --config config/policy.json
```

Exit codes: `0` verified match/allow; `2` drift/block; `3` invalid input/block.

Run tests:

```bash
python -m unittest tests/test_permission_rebinding_guard.py
```

## Workflow
Observe authoritative policy state -> measure baseline transition mismatches -> diagnose resolver/lifecycle path -> form a hypothesis -> implement repair -> measure again -> independently verify -> allow the child only on a verified match. Repair cycles are bounded to three; snapshot collection retries are bounded to two.

## Metrics
- transition-audit coverage
- mismatch rate
- unapproved broadening events blocked
- restrictive/stale drift detected before first tool call
- policy provenance/hash coverage
- false-positive rate
- mean diagnosis time

## Verification
**Implemented:** package contract, checker, tests, rules, workflow, hook, and independent verifier are present.

**Measured:** a deployment must capture its own transition baseline and before/after mismatch metrics.

**Verified:** deterministic tests must pass and integration fixtures must show that correct inheritance is allowed while broadening, restrictive reset, stale role policy, and missing provenance are blocked before tool execution.

## Safety
The expected envelope must come from authoritative configuration/runtime control state, never from the child model itself. Do not broaden authority to repair a mismatch. Dangerous or irreversible authorization changes require explicit human approval. Logs must contain hashes/diffs rather than secrets.

## Failure handling
Detection: checker mismatch, missing required field, unknown permission value, or unavailable authoritative snapshot. Evidence: preserve normalized non-secret policy snapshots/hashes and transition identifiers. Retry: at most two times for transient snapshot collection and at most three repair cycles with changed evidence/hypothesis. Fallback: fail closed. Escalation: runtime/security owner, then human approval boundary for intentional broadening. Stop: confirmed mismatch, missing provenance after retries, or successful independent verification.

## Definition of Done
Evidence documented; baseline captured; limitations/root cause identified; expected permission envelope defined; deterministic gate integrated; tests pass; before/after metrics collected; unapproved broadening blocked; restrictive/stale drift surfaced; required approvals recorded; independent verification complete; no secrets included; no blocking issue remains.

## Customization
Add platform-specific permission fields or role precedence only when their semantics are authoritative and testable. Keep the invariant that every resumed/retargeted child turn is verified against the current expected contract before privileged tool execution.
