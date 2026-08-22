# Evidence Retention Workflow

## Trigger
Use when an AI-assisted task accumulates enough logs, test output, diffs, API/database evidence, research material, approvals, or review artifacts that context pressure could cause ad-hoc truncation or unsafe evidence loss.

## Entry conditions
- Task scope is known.
- Relevant source evidence is still available.
- Evidence budgeting is for context/handoff efficiency, not source deletion.

## Inputs
Task ID, repository revision when relevant, claims, source-artifact metadata, policy, implementation-owner identity.

## Context
Load repository structure and task-local evidence first. Expand only when a claim lacks support. Store authoritative evidence outside model context and retain value-free metadata references.

## End-to-end flow
```text
Trigger
  ↓
Enumerate claims
  ↓
Collect source metadata + hashes
  ↓
Build evidence bundle
  ↓
Validate bundle
  ↓
Apply retention policy
  ↓
Resolve stale/missing/budget blockers (max 2 rebudget cycles)
  ↓
Critical evidence? ── yes ─→ Independent review
  ↓ no                         ↓
Final retention gate ←─────────┘
  ↓
Handoff bounded context + fingerprints
  ↓
Task-specific verification
  ↓
Complete
```

## Stages
### 1. Claim inventory — Evidence Curator
Classify statements as `fact`, `hypothesis`, `decision`, `executed`, `verified`, `blocked`, or `open`. `verified` and `blocked` claims must identify required evidence.

Checkpoint: no mandatory claim is evidence-free.

### 2. Evidence inventory — Evidence Curator
For each source artifact record type, source, observation time, SHA-256, durable storage reference, estimated full-context cost, importance, sensitivity, and claim mappings. Never copy secret values.

Checkpoint: every evidence ID is unique and every required reference resolves within the bundle.

### 3. Deterministic validation
Run:
```bash
python scripts/validate-evidence-bundle.py \
  --bundle artifacts/evidence-bundle.json \
  --policy config/evidence-retention-policy.json \
  --output artifacts/bundle-validation.json
```

Validation failure is not retryable. Correct the evidence metadata or block.

### 4. Deterministic budgeting
Run:
```bash
python scripts/apply-retention-policy.py \
  --bundle artifacts/evidence-bundle.json \
  --validation artifacts/bundle-validation.json \
  --policy config/evidence-retention-policy.json \
  --output artifacts/retention-plan.json
```

Checkpoint: context bytes remain within budget; mandatory evidence keeps at least reference metadata; prohibited sensitivity is reference-only.

### 5. Remediation / rebudget
If blocked:
- Refresh only stale mandatory evidence.
- Add missing summaries where source-backed and safe.
- Remove duplicate/non-required active context, never authoritative source artifacts.
- Re-run validation and budgeting.

Maximum two rebudget cycles. Preserve prior failed outputs.

### 6. Independent review — Evidence Reviewer
Required when critical evidence exists and policy says so. The reviewer must differ from implementation owner and bind approval to exact bundle and retention fingerprints.

### 7. Human approval boundary
Stop before `delete-source-evidence`, policy weakening, audit/security artifact removal, production-log purge, secret/production-config changes, or another policy-listed dangerous action. Agents cannot self-authorize.

### 8. Final gate
Run:
```bash
python scripts/evaluate-retention-gate.py \
  --bundle artifacts/evidence-bundle.json \
  --validation artifacts/bundle-validation.json \
  --retention artifacts/retention-plan.json \
  --policy config/evidence-retention-policy.json \
  --implementation-owner implementation-agent \
  --review artifacts/evidence-review.json \
  --output artifacts/retention-gate.json
```
Omit `--review` only when policy does not require it. Add `--approval-ref` only for an actual externally granted approval.

Only `status=verified` permits the bounded evidence handoff.

### 9. Handoff
Provide the next agent with:
- claims needed for its stage;
- selected full/summary context;
- reference-only metadata for non-loaded evidence;
- bundle fingerprint;
- retention fingerprint;
- current blockers/open questions.

### 10. Task-specific verification
Evidence budgeting does not prove the engineering task itself. Build/test/API/database/security verification must still complete under the task's own workflow.

## Retry rules
- Transient source/tool metadata read: retry once, preserving the first error.
- Validation/policy/security/permission failure: zero automatic retries.
- Rebudget: maximum two cycles.
- Repeated failure after budget: block and escalate with evidence.

## Failure paths
- Missing source evidence → affected claim blocked.
- Stale mandatory evidence → refresh or block.
- Hash/reference mismatch → stale evidence; re-fetch/re-hash.
- Context budget cannot retain mandatory metadata → block.
- Critical self-review or stale review → new independent review.
- Permission failure → stop; do not elevate permission.
- Dangerous deletion/retention weakening → human approval required.

## Definition of Done
- Bundle validation is verified.
- Retention plan is within budget and not stale.
- Mandatory evidence remains traceable and retrievable.
- Sensitive evidence is not embedded contrary to policy.
- Required independent review is current.
- Required human approval exists for dangerous actions.
- Final retention gate is verified.
- Downstream task verification remains separate and explicit.
