# Workflow: API Contract Regression Gate

## Trigger
Run when an AI-assisted change may alter a public or partner-facing HTTP API, before merge/release/deployment.

## Entry conditions
- Repository is available and readable.
- Candidate implementation builds far enough to generate or expose OpenAPI.
- An accepted baseline can be identified.

## Inputs
- Baseline OpenAPI source.
- Candidate OpenAPI source.
- Relevant code diff.
- Acceptance criteria.
- `config/gate.yaml`.

## Flow

```text
Trigger
  ↓
Validate repository + identify API surface
  ↓
Capture baseline
  ↓
Capture candidate
  ↓
Deterministic comparison
  ↓
Breaking findings? ── yes ─→ independent review ─→ human approval required
  │
  no
  ↓
Relevant build/tests
  ↓
Independent contract review
  ↓
Final verification
  ↓
Complete
```

## Stages

### 1. Context
Responsible: workflow owner.

Actions:
1. Locate API project, OpenAPI generation mechanism, controllers/endpoints, DTOs, and contract tests.
2. Identify the accepted baseline release or artifact.
3. Limit context to changed API surfaces and their dependencies.

Checkpoint: baseline identity and candidate generation path are explicit.

### 2. Capture baseline
Responsible: workflow owner using `skills/capture-contract-baseline.md`.

Tool: `scripts/capture-openapi.sh`.

Artifact: `artifacts/openapi-baseline.json`.

Retry: maximum 2 retries for transient network failures only. Permission or parse failures do not retry without changed evidence.

### 3. Capture candidate
Responsible: workflow owner.

Generate OpenAPI from the candidate build or approved local/HTTP source, then run the same capture script.

Artifact: `artifacts/openapi-candidate.json`.

Checkpoint: candidate must correspond to the code being evaluated.

### 4. Compare
Responsible: workflow owner using `skills/compare-contracts.md`.

Command:
`python3 scripts/compare-openapi.py --baseline artifacts/openapi-baseline.json --candidate artifacts/openapi-candidate.json --output artifacts/api-contract-report.json`

Exit behavior:
- `0`: continue.
- `2`: breaking changes found; continue only to independent review and approval handoff.
- `1`: stop as validation/tool failure.

Retry: maximum 1 retry, only after correcting/regenerating invalid input.

### 5. Test
Responsible: implementation/test owner.

Run repository-native build and relevant unit/integration/contract tests. Do not invent a generic command if the repository defines its own.

Checkpoint: failures return to implementation with preserved logs; maximum 2 implementation/test cycles before escalation.

### 6. Independent review
Responsible: `subagents/contract-reviewer.md`.

Review the report, diff, tests, and semantic compatibility risks. The implementing agent must not be the sole verifier.

### 7. Approval
Required when the report confirms a breaking contract or when semantic review identifies a breaking consumer-visible behavior.

Protected actions remain blocked until a human explicitly approves the change. Approval does not erase findings; preserve them with migration notes.

### 8. Final verification
Run `python3 scripts/verify-package.py .` for kit integrity when modifying the kit itself. For repository use, verify:
- exact baseline/candidate evidence retained;
- comparison report exists and is parseable;
- deterministic comparison completed;
- relevant build/tests passed;
- independent review completed;
- required approval exists when applicable;
- unresolved risks are documented.

## Failure paths
- Transient capture failure → retry up to 2 times, preserving the error.
- Invalid contract → stop; regenerate/fix input, then at most 1 comparison retry.
- Build/test failure → return to implementation; maximum 2 cycles.
- Permission failure → stop and escalate; never increase privileges silently.
- Breaking change without approval → `needs-approval` and stop protected actions.
- Repeated failure → `blocked`, preserving artifacts, logs, findings, and last attempted action.

## Definition of Done
- Baseline and candidate are both captured from known sources.
- Comparison report was produced successfully.
- No unapproved breaking change remains.
- Relevant build/tests passed.
- Independent contract review completed.
- Required approval is recorded when a breaking contract is intentional.
- Remaining risks are explicit.
