# Worktree Isolation Invariant Guard

**Category:** Security

## Problem and evidence
Concurrent coding agents can suffer CWD/worktree identity drift and silently target a sibling checkout. `evidence/research.md` documents two independent August 2026 Claude Code reports, including cross-worktree branch mutation and shared isolation identity symptoms.

## Existing approach and limitation
Worktree isolation, `pwd`, HEAD/branch checks, and absolute paths reduce risk, but any single identity signal can be stale or insufficient. Identical commits make HEAD SHA especially weak as checkout identity proof.

## Proposed improvement
Treat checkout routing as a command-time security invariant: compare a trusted expected root with canonical Git top-level, registered worktree membership, CWD, optional expected branch, and intended write paths immediately before mutation. Block any mismatch. Reverify after handoff/resume or identity transitions.

## Architecture
The boundary-analysis Skill defines the procedure; Rules make the trust boundary enforceable; an independent verifier reviews high-risk work; the workflow bounds recovery; the pre-command hook runs a deterministic read-only verifier; real Git tests exercise pass and escape/mismatch paths.

## Package tree
```text
README.md
evidence/research.md
skills/worktree-boundary-analysis.md
rules/worktree-isolation-rules.md
subagents/worktree-security-verifier.md
workflows/assert-execute-reverify.md
hooks/pre-command-worktree-gate.md
scripts/verify_worktree.py
tests/test_verify_worktree.py
```

## Installation
Requires Python 3.9+ and Git. No third-party Python packages. The orchestrator must supply `EXPECTED_WORKTREE` from trusted assignment/configuration rather than current shell state.

## Configuration
Expected root is mandatory. Expected branch is recommended when each concurrent agent owns a dedicated branch. Supply every known target using repeated `--write-path` arguments. Keep destructive Git approvals separate.

## Usage
`python3 scripts/verify_worktree.py --expected-root /abs/worktree --expected-branch agent-branch --write-path src/file.cs`

Run tests with `python3 -m unittest tests/test_verify_worktree.py`.

Exit 0 is PASS, 2 is unverifiable/invalid, and 3 is an invariant violation.

## Workflow
Follow `workflows/assert-execute-reverify.md`: resolve trusted assignment → assert → execute authorized operation → reassert after transitions → task/security tests → independent verification. A mismatch permits only one trusted reassignment/re-resolution attempt.

## Metrics
Invariant violations caught, wrong-tree mutations blocked by tests, handoff mismatches, false-block rate, gate latency, and security-test regression rate.

## Verification
Security verification requires: correct worktree passes; wrong expected root blocks; path escape blocks; configured branch mismatch blocks; Git metadata remains read-only; task tests pass; independent Worktree Security Verifier returns PASS.

## Safety
This guard verifies location, not authorization. It MUST NOT authorize `reset --hard`, force push, destructive restore/checkout, or other irreversible operations. Existing human approvals, OS sandboxing, filesystem permissions, branch protection, and secret policies remain mandatory.

## Failure handling
Detection is deterministic exit status and violation evidence. On mismatch, do not mutate. Re-resolve trusted assignment once; if mismatch remains, stop and escalate. Never repair a failure by changing the expected root to whatever tree happens to be active.

## Implemented / Measured / Verified
**Implemented** means the hook/script is integrated. **Measured** means gate results and overhead are captured on representative workflows. **Verified** means wrong-tree attack/failure paths are blocked, permissions remain intact, security/task tests pass, and independent review passes.

## Definition of Done
Evidence documented; trusted assignment established; pre-mutation gate integrated; path/root/branch/worktree checks exercised; wrong-tree and path-escape tests block; task tests pass; approval boundaries are preserved; no secrets are exposed; independent verification passes; no blocking mismatch remains.

## Customization
Add orchestrator-signed assignment IDs, per-agent worktree leases, operation allowlists, or platform audit events. Extend tests with real sibling worktrees and handoff simulations while retaining canonical-path and trusted-assignment invariants.