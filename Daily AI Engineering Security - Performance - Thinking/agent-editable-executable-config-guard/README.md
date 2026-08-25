# Agent-Editable Executable Configuration Guard

## Topic
Prevent agent file-write permission from silently becoming code-execution permission through lifecycle hooks, custom-agent definitions, editor tasks, or equivalent executable configuration.

## Category
Security

## Problem
Agent hosts often grant broad edit capability for productivity, but some editable files are control-plane configuration whose later consumption can execute shell commands. Recent VS Code vulnerabilities demonstrate that prompt injection plus auto-edit can cross this boundary.

## Evidence
See `evidence/research.md`. Key current signals are Microsoft GHSA-w79w-rj9h-vg4f and GHSA-3hjg-cwxj-qfc6, both published 2026-08-11 and fixed in VS Code 1.132.1.

## Existing approach
Workspace trust, edit confirmations, sensitive-file prompts, worktrees, prompt-injection defenses and code scanning.

## Existing limitations
Workspace/path trust does not by itself express whether a file edit registers future execution. Approvals can also become stale when content changes, and the same agent may otherwise implement and self-verify the change.

## Proposed improvement
Treat executable configuration as a separate capability. Statically classify proposed writes, block privileged changes until the exact bytes are SHA-256 approved, recheck after write, then require independent verification before consumption.

## Architecture
- `evidence/research.md` — current evidence, approaches, gaps and root causes.
- `skills/privileged-config-review.md` — evidence-driven review procedure.
- `rules/executable-config-policy.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/review-write-verify.md` — bounded end-to-end flow.
- `hooks/pre-write-gate.md` — deterministic blocking hook contract.
- `scripts/config_guard.py` — dependency-free classifier and hash-bound approval gate.
- `tests/test_config_guard.py` — security regression tests.

## Actual package tree
```text
agent-editable-executable-config-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-write-gate.md
├── rules/executable-config-policy.md
├── scripts/config_guard.py
├── skills/privileged-config-review.md
├── subagents/security-verifier.md
├── tests/test_config_guard.py
└── workflows/review-write-verify.md
```

## Installation
Requires Python 3.9+ only. Copy the package directory into an environment where the host can invoke the pre-write gate before agent file writes.

## Configuration
No secrets or network access are required. Hosts may extend `RISKY_PATHS` and `EXEC_KEYS` in `scripts/config_guard.py` for additional executable configuration formats, but should add tests before deployment.

## Usage
```bash
python scripts/config_guard.py .claude/settings.json /tmp/proposed.json
# privileged, unapproved content => exit 10
python scripts/config_guard.py .claude/settings.json /tmp/proposed.json --approved-sha256 <exact-sha256>
# exact approved content => exit 0
python -m unittest tests/test_config_guard.py
```

## Workflow
Follow `workflows/review-write-verify.md`: Observe → measure baseline → diagnose capability delta → form necessity hypothesis → exact-content approval → implement → measure again → independent verify → complete. Maximum two implementation attempts; any content change invalidates approval.

## Metrics
Track detected privileged writes, blocked unapproved changes, stale approval mismatches, test pass rate, false-positive rate, verified execution-config consumption and review latency.

## Verification
**Implemented:** static classifier, content hash, policy, workflow, verifier and tests exist. **Measured:** the guard reports path classification, indicators and exact digest. **Verified:** unit tests pass, the final on-disk digest equals the approved digest, and the independent verifier returns PASS. Never report Verified from implementation alone.

## Safety
The scanner never executes or imports project configuration. New/expanded shell or lifecycle execution requires explicit human approval. Security boundaries must not be weakened for convenience.

## Failure handling
Detection: nonzero guard exit, digest mismatch, failed test or verifier BLOCK. Evidence: retain metadata/digests without secret contents. Retry: maximum two implementation attempts; fresh approval after every content mutation. Fallback: keep/restore prior safe configuration when feasible. Escalation: human owner. Stop condition: no exact approval or deterministic verification.

## Definition of Done
Evidence documented; baseline captured; gap and capability delta identified; exact approved bytes implemented; guard and tests pass; final digest matches; independent verification passes; risks recorded; no blocking issue remains.

## Customization
Extend risky path/key detection for additional hosts such as IDE tasks, custom agent registries or workflow engines. Keep content-bound approval and independent verification invariant.
