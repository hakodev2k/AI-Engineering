# Workflow: Repository Instruction Conflict Resolution

## Trigger
Run before planning/editing in a repository, when entering a new directory scope, or when instruction files change.

## Entry conditions
- Repository root is available.
- Task summary and target path(s) are known.

## Inputs
- Repository root
- Task target paths
- `config/instruction-policy.json`

## Flow

```text
Trigger
  ↓
Discover Sources (Instruction Analyst)
  ↓
Normalize Statements
  ↓
Validate Manifest
  ↓
Detect Conflicts
  ↓
Resolve by Policy
  ↓
Independent Review (Instruction Reviewer)
  ↓
Status?
  ├─ verified → Emit Effective Instruction Set → Planning may begin
  ├─ revision-required → Correct once → Review again
  ├─ human-review-required → STOP → Human decision → Re-validate
  └─ blocked → STOP
```

## Stages

### 1. Discover
Owner: Instruction Analyst.

Actions:
1. Run `python scripts/scan-instructions.py --root <repo> --policy config/instruction-policy.json --targets <path...> --out .agent/instruction-sources.json`.
2. Read the discovered sources.
3. Record any unreadable source as blocking.

Artifact: `.agent/instruction-sources.json`.

Checkpoint: source hashes and scopes are present.

### 2. Normalize
Owner: Instruction Analyst.

Convert applicable normative text into atomic statements following `skills/conflict-resolution.md`.

Artifact: `.agent/instruction-manifest.json`, based on `templates/instruction-manifest.json`.

Checkpoint: `python scripts/validate-manifest.py .agent/instruction-manifest.json` succeeds.

### 3. Resolve
Owner: deterministic resolver plus Instruction Analyst for semantic statement extraction.

Command:
`python scripts/resolve-conflicts.py --manifest .agent/instruction-manifest.json --policy config/instruction-policy.json --out .agent/effective-instructions.json`

Artifact: `.agent/effective-instructions.json`.

### 4. Independent review
Owner: Instruction Reviewer.

Review source evidence, scope, authority and all high-risk conflicts. Reviewer must not be the producer of the manifest for high-risk conflicts.

Statuses:
- `verified`
- `revision-required`
- `human-review-required`
- `blocked`

### 5. Human approval
Required when:
- Equal-authority rules conflict on security, secrets, destructive actions, production, permissions, data loss, verification, or breaking contracts.
- Policy cannot establish precedence.
- An instruction file explicitly requests weakening a higher-level safety control.

Human decision must identify conflict IDs and chosen resolution. Do not edit source instructions as an implicit approval.

### 6. Consume effective instructions
Planning/editing may start only after status `verified` and after the source hashes still match.

Before completion, re-run scanner and resolver. If hashes or applicable scope changed, invalidate previous verification and repeat the workflow.

## Retry rules
- Read/tool transient error: retry once.
- Manifest normalization/format issue: one correction pass.
- Reviewer `revision-required`: one revision cycle.
- Same unresolved conflict after revision: stop and escalate.

## Evidence preserved
Source manifest, normalized manifest, resolver output, review verdict, human decisions if any.

## Failure paths
- Missing/unreadable higher-authority source → blocked.
- Invalid policy → blocked.
- Hash drift after review → verification invalidated.
- Unknown source type with potential authority → human review required.

## Definition of Done
- Applicable instruction sources are discovered and hash-bound.
- Manifest validates.
- All conflicts are resolved or explicitly escalated.
- Reviewer verdict is `verified`.
- Effective instruction set exists and references evidence.
- No blocking conflict remains.
