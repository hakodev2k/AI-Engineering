# Dead Code Removal Workflow

## Trigger
A developer, static analyzer, cleanup task, feature retirement, dependency removal, or agent proposes that code may be unused.

## Entry conditions
- Candidate identity is known.
- Repository root and revision are available.
- Policy file is accessible.

## Required inputs
Candidate identifier/kind/path, repository revision, framework/runtime context, test/build commands, and any available runtime evidence.

## Flow

```text
Trigger
  ↓
Identify candidate + exposure
  ↓
Evidence Analyst collects channels
  ↓
Validate evidence record
  ↓
Live reference or unknown required channel?
  ├─ Yes → Block / Investigate
  └─ No
       ↓
Independent Removal Reviewer
       ↓
Decision accepted?
  ├─ No → Revise evidence (max 1 review revision) or Block
  └─ Yes
       ↓
Approval required?
  ├─ Yes → Stop for human approval
  └─ No / Approved
       ↓
Smallest removal plan
       ↓
Remove candidate + directly orphaned artifacts only
       ↓
Post-removal scan + build/tests + diff review
       ↓
Unexpected reference/failure?
  ├─ Yes → Restore/revise; one bounded verification retry for transient failures
  └─ No → Verified
```

## Stages

### 1. Candidate classification — Evidence Analyst
Produce candidate metadata: symbol/path/kind/visibility/exposure/revision.
Checkpoint: ambiguous identity blocks.

### 2. Multi-channel evidence collection — Evidence Analyst
Use `skills/dead-code-evidence-collection.md` and `scripts/scan-references.py`.
Artifact: evidence JSON based on `schemas/dead-code-evidence.schema.json`.
Checkpoint: any `reference-found` blocks; required `unknown` keeps status `investigating`.

### 3. Deterministic evidence validation
Run `python scripts/validate-evidence.py <record> --policy config/dead-code-policy.json`.
Checkpoint: non-zero exit blocks progression.

### 4. Independent review — Removal Reviewer
Check missing channels, external/public exposure, dynamic discovery, observation-window limitations, and policy compliance.
Artifact: review decision in evidence record or adjacent review note.
Retry rule: one evidence revision after `revise`; a second `revise` stops for human escalation.

### 5. Human approval gate
Mandatory for file deletion, public/external contract removal, production/config/infrastructure changes, DB/data changes, security-control removal, and policy-listed high-risk candidate kinds.
No agent may synthesize approval.

### 6. Removal execution
Use `skills/removal-plan-and-verification.md`.
Change only the candidate and directly orphaned imports/registrations/tests/config/docs that were included in the reviewed plan.
Artifact: changed-file list.

### 7. Post-removal verification
- Re-run deterministic references scan.
- Run targeted tests.
- Run policy-required build/regression/static checks.
- Inspect git diff/unexpected files.
- Confirm no stale registrations/config/routes remain.
Artifact: verification evidence.

## Retry rules
- Transient tool failure: at most one retry, preserving first-failure evidence.
- Review revision: at most one revision cycle.
- Deterministic build/test/reference failure: no blind retry; diagnose, restore, or stop.

## Failure paths
- Reference found → `blocked`.
- Required evidence unknown → `investigating`.
- Missing approval → `approved-pending-human`.
- Verification regression → `failed`; restore/revise.
- Tool/environment unavailable → `blocked` unless another equivalent evidence source is explicitly documented.

## Definition of Done
- Candidate evidence record validates.
- Independent review accepted.
- Required approval exists.
- Removal scope matches reviewed plan.
- Post-removal reference scan is clear.
- Required tests/build/static checks pass.
- No unintended files changed.
- Remaining risks are documented.
- Final `verification_status` is `verified`.

`removed` is not equivalent to `verified`.