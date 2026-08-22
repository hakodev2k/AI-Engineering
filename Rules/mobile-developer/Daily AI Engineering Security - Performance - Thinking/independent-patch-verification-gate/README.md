# Independent Patch Verification Gate

**Category:** Thinking

## Problem
Coding agents commonly verify patches using the same interpretation and assumptions that produced them. Passing tests or successful write tools do not prove that the patch addresses the original issue, preserves integrity, or covers missing acceptance criteria.

## Evidence
See `evidence/research.md`. Current research reports measurable gains from independent reconstruction-based patch verification and evidence-gated lifecycle control. Public Codex reports also show tool-level write success can coexist with truncated/corrupted output, reinforcing the need for integrity evidence.

## Existing approach
Tests, CI, self-review, diff inspection, and optional human review.

## Existing limitations
Tests may not encode intent, self-review is correlated with implementation assumptions, CI can pass without behavioral coverage, and unattended workflows may lack human review. Evidence is often stale or not bound to the current source state.

## Proposed improvement
Freeze acceptance criteria, bind evidence to a source-state identity, use a separate verifier to reconstruct the behavior/problem represented by the patch, compare it to the original task, validate file/diff integrity, run required tests, and gate completion on fresh evidence.

## Architecture
- `skills/spec-bound-verification.md`: verification procedure.
- `rules/verification-rules.md`: observable requirements.
- `subagents/independent-verifier.md`: independent verification role.
- `workflows/implement-reconstruct-verify.md`: bounded lifecycle.
- `hooks/pre-completion-evidence-gate.md`: deterministic DONE gate.
- `scripts/verify_evidence.py`: machine-readable report validator.

## Package tree
```text
README.md
evidence/research.md
skills/spec-bound-verification.md
rules/verification-rules.md
subagents/independent-verifier.md
workflows/implement-reconstruct-verify.md
hooks/pre-completion-evidence-gate.md
scripts/verify_evidence.py
```

## Installation
Requires Python 3.9+ for report validation and normal repository/test tools. Integrate the hook before DONE/ready-to-merge lifecycle transitions.

## Configuration
Define required acceptance criteria, source-state identifier format (commit/tree SHA preferred), required tests/static checks, and integrity checks appropriate to the repository.

## Usage
Create `report.json` containing `source_state`, `status`, `criteria`, `tests`, `integrity`, and `reconstructed_intent`, then run:

`python3 scripts/verify_evidence.py report.json --expected-source <sha>`

Exit 0 means the structural evidence gate passes; 2 means invalid input; 3 means stale, failed, or incomplete evidence.

## Workflow
Freeze criteria → implement → capture current diff/integrity/test evidence → independent reconstruction → compare with task → verify → PASS or bounded revision. Maximum two implementation-reverification cycles.

## Metrics
Acceptance-criterion evidence coverage, unsupported conclusions, stale-evidence count, integrity anomalies, revision cycles, test failures, post-merge regression rate.

## Verification
A candidate is verified only when the independent verifier returns PASS, required tests were executed against the same source state, integrity checks pass, reconstructed patch intent aligns with the original task, and the deterministic completion hook accepts the report.

## Safety
The verifier is read-only and must not silently alter the patch or acceptance criteria. Destructive remediation requires explicit human approval. Missing evidence produces BLOCK, not optimistic completion.

## Failure handling
Detection: gate failure, intent contradiction, stale evidence, integrity anomaly, or required test failure. Retry: maximum two revision cycles. Fallback: remain BLOCKED with evidence-linked findings. Escalation: only unresolved mandatory criteria. Stop after two failed cycles or on unresolved requirement ambiguity.

## Implemented / Measured / Verified
Implemented means the gate exists. Measured means evidence coverage, test, and revision metrics were recorded. Verified means the current source state passed independent alignment, integrity, and test gates. These states must remain distinct.

## Definition of Done
Evidence documented; criteria frozen; source state recorded; patch integrity checked; independent intent reconstruction completed; all mandatory criteria mapped to fresh evidence; required tests pass on current state; verifier returns PASS; completion hook passes; no blocking issue remains.

## Customization
Add repository-specific integrity checks, schema validation, mutation/property tests, or domain-specific acceptance evidence. Keep verifier independence and source-state binding intact.