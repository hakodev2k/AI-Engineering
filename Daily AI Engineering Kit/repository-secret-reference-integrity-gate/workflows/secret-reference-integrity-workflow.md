# Workflow: Repository Secret Reference Integrity

## Trigger
Run when a change adds/removes/renames a secret reference, edits CI/deployment/environment configuration, changes a configuration consumer, modifies provisioning metadata, or before release when secret-reference integrity is part of the safety gate.

## Entry conditions
- Repository and current HEAD are readable.
- Policy exists.
- Secret values are not required for the integrity check.

## Inputs
Task scope, repository root, policy, existing contract declarations, relevant diff, optional name-only provider metadata, and implementation-owner identity.

## Flow
```text
Trigger
  ↓
Capture current HEAD and affected config surfaces
  ↓
Secret Reference Analyst scans references
  ↓
Build/refresh value-free contracts
  ↓
Validate inventory + fingerprint
  ↓
Resolve repository-only mismatches where evidence is authoritative
  ↓
Re-scan after edits
  ↓
Independent review when required
  ↓
Human approval boundary for secret/provider mutation
  ↓
Final integrity gate
  ↓
verified / human-approval-required / blocked
```

## Stages

### 1. Scope and context
**Owner:** implementation owner + Secret Reference Analyst  
**Tools:** Git/read/search  
Identify changed paths, config consumers, workflows, deployment manifests, and runbook/provisioning references. Capture HEAD.

**Checkpoint:** No secret value has been requested or loaded.

### 2. Discover references
**Owner:** Secret Reference Analyst  
Run:
```bash
python scripts/scan-secret-references.py --repo . --policy config/secret-reference-policy.json --contracts secret-contracts.json --output artifacts/secret-inventory.json
```

**Artifact:** current inventory + fingerprint.

### 3. Validate contracts
**Owner:** deterministic script  
Run:
```bash
python scripts/validate-secret-inventory.py --inventory artifacts/secret-inventory.json --policy config/secret-reference-policy.json --output artifacts/secret-validation.json
```

**Checkpoint:** Unknown required references and conflicting contracts block. Alias/stale contract findings require review according to policy.

### 4. Reconcile
**Owner:** implementation owner using `skills/reconcile-secret-contracts.md`  
Repository-only typo/rename fixes may proceed when canonical evidence is proven. Any provider-side create/delete/rotate/rename/rebinding or permission increase stops for human approval.

After any repository edit, return to Stage 2. Maximum reconciliation cycles: **2**. A third unresolved cycle blocks and escalates.

### 5. Independent review
**Owner:** Secret Integrity Reviewer  
Required for production contracts and policy-triggered findings. Reviewer must differ from implementation owner when independence is required.

**Artifact:** review JSON bound to exact HEAD and inventory fingerprint.

### 6. Approval point
If reconciliation requires an action listed in `approval_required_actions`, stop. Human approval must name exact action, secret name, scope and expiry. Approval never authorizes exposing the secret value or unrelated secret changes.

### 7. Final gate
Run:
```bash
python scripts/evaluate-secret-integrity-gate.py \
  --inventory artifacts/secret-inventory.json \
  --validation artifacts/secret-validation.json \
  --review artifacts/secret-review.json \
  --policy config/secret-reference-policy.json \
  --implementation-owner implementation-agent \
  --output artifacts/secret-gate.json
```

Only `verified` may satisfy this workflow.

## Retry rules
- Transient file/Git/provider metadata read failure: retry at most **1** time, preserving first error.
- Validation/policy/security/permission/business-rule failure: **0** automatic retries.
- Reconciliation after a concrete reviewer finding: at most **2** total scan→reconcile cycles.
- Never retry by increasing permissions or changing canonical names without evidence.

## Failure paths
- Secret value becomes necessary → stop and redesign the check around metadata/fingerprints.
- Provider metadata unavailable with current permissions → preserve limitation; production result cannot be verified if that evidence is mandatory.
- HEAD changes after scan/review → invalidate artifacts and rescan.
- Inventory fingerprint mismatch → block.
- Conflicting authoritative evidence → block and escalate.
- Dangerous provider mutation → human approval required.

## Definition of Done
- Current HEAD captured.
- In-scope secret references scanned.
- Every relevant reference maps to a declared canonical contract or has been resolved.
- Required contracts have known source kind, scope, and consumers.
- No secret values were collected.
- Alias/conflict/production findings received required independent review.
- Any required dangerous action has valid explicit approval before execution.
- Validation is not blocked.
- Final gate returns `verified` for the current HEAD/fingerprint.
- Remaining risks/open questions are explicit and non-blocking.
