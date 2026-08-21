# Sensitive Context Release Gate Workflow

## Entry condition

Start this workflow whenever an AI agent, automation, tool adapter, or subagent intends to send repository-derived, log-derived, environment-derived, database-derived, or user-derived context across a trust boundary.

## Required inputs

- task objective;
- destination name/type;
- destination trust level or policy mapping;
- candidate source locations;
- sensitivity policy;
- local workspace for candidate/release/report artifacts.

## Flow

```text
Trigger
  ↓
Define Destination + Purpose
  ↓
Minimize Context              [Context Curator]
  ↓
Create Release Request        [Context Curator]
  ↓
Deterministic Scan            [scan-sensitive-context.py]
  ↓
Policy Decision
  ├─ deny → Stop
  ├─ approval-required → Reviewer/Human Checkpoint
  ├─ redact → Redact Artifact
  └─ allow → Continue
                     ↓
Semantic Review if needed     [Privacy & Security Reviewer]
                     ↓
Redact / Revise if needed     [redact-context.py / Context Curator]
                     ↓
Verification                  [verify-sanitization-report.py]
                     ↓
Pre-Send Checkpoint
                     ↓
Destination Transmission      [Destination Adapter]
                     ↓
Record Release Evidence
                     ↓
Verified Complete
```

## Stages

### Stage 0 — Define the boundary

**Responsible:** Orchestrator

Record:

- destination;
- purpose;
- expected output from the destination;
- trust classification;
- whether external transmission is necessary.

**Checkpoint:** Unknown destination trust defaults to external/untrusted.

### Stage 1 — Minimize candidate context

**Responsible:** Context Curator

Produce:

- candidate context file;
- minimization notes;
- candidate SHA-256 hash;
- context-release request.

**Checkpoint:** Full files, logs, dumps, or conversation histories require justification when excerpts would suffice.

### Stage 2 — Deterministic scan

**Responsible:** `scripts/scan-sensitive-context.py`

Example:

```bash
python scripts/scan-sensitive-context.py \
  --input .agent-context/candidate.txt \
  --destination external-model \
  --output .agent-context/sanitization-report.json
```

**Artifacts:** sanitization report.

**Failure behavior:** retry once only for operational/configuration errors. Second failure stops the workflow.

### Stage 3 — Policy disposition

**Responsible:** Orchestrator using report + rules

- `allow` → continue.
- `redact` → Stage 5.
- `approval-required` → Stage 4.
- `deny` → stop.

The workflow does not retry denied disclosures through another tool.

### Stage 4 — Semantic review and human approval

**Responsible:** Privacy & Security Reviewer, then human when required.

Semantic review is mandatory for:

- high-severity findings;
- external/untrusted destinations with PII/confidential data;
- requested false-positive overrides;
- policy ambiguity;
- context whose business meaning is sensitive even without detector matches.

Human approval must identify:

- destination;
- purpose;
- candidate hash;
- finding category;
- override reason;
- approval scope.

**Human approval point:** Any requested policy exception, new external processor, production-data disclosure, or detector/policy weakening.

### Stage 5 — Redact or revise

**Responsible:** deterministic redactor for detected spans; Context Curator for semantic minimization.

```bash
python scripts/redact-context.py \
  --input .agent-context/candidate.txt \
  --report .agent-context/sanitization-report.json \
  --output .agent-context/released.txt
```

Never edit the source candidate in place.

### Stage 6 — Verify

**Responsible:** `scripts/verify-sanitization-report.py`

```bash
python scripts/verify-sanitization-report.py \
  --report .agent-context/sanitization-report.json \
  --released .agent-context/released.txt
```

**Checkpoint:** Verification must pass before the send adapter runs.

### Stage 7 — Transmit exact artifact

**Responsible:** destination adapter

The adapter must receive the path/hash of `released.txt` (or an equivalent verified release artifact), not the source candidate.

If destination or artifact changes, invalidate the prior decision and restart at Stage 0 or Stage 2 as appropriate.

### Stage 8 — Record evidence

**Responsible:** Orchestrator

Record non-sensitive metadata:

- candidate hash;
- release hash;
- destination;
- purpose;
- report path/hash;
- reviewer decision;
- approval reference if required;
- send result;
- verification result.

Do not persist raw detected values in evidence.

## Retry rules

- Scanner operational error: maximum 1 retry.
- Redaction operational error: maximum 1 retry from original candidate.
- Verification mismatch: maximum 1 regeneration/reverification cycle.
- Semantic review revision: maximum 1 curator revision before escalation.
- Idempotent destination send transient failure: maximum 2 retries if destination and artifact remain unchanged.
- Denied disclosure: 0 retries.
- Missing/mismatched human approval: 0 autonomous retries; stop at approval checkpoint.

## Stop conditions

Stop when:

- a deny decision exists;
- required approval is missing;
- scanner/redactor/verifier exceeds its retry budget;
- destination trust cannot be established and untrusted-mode blocks release;
- source or destination changes after verification;
- the only way to continue is to disable safeguards;
- context cannot be minimized enough to meet policy.

## Dangerous downstream actions

This context gate does not itself authorize downstream mutations. If the receiving agent proposes database schema changes, production deployment/configuration, file deletion, force push, infrastructure changes, secret updates, security-control changes, breaking API changes, or large dependency upgrades, the receiving workflow must obtain explicit human approval separately.

## Definition of Done

### Task completed

The requested context has been prepared and, if allowed, transmitted to the intended destination.

### Task verified

All of the following are true:

- destination and purpose are recorded;
- candidate context was minimized;
- scan report is valid;
- every finding has a disposition;
- required redactions are reflected in the released artifact;
- required approval is exact and recorded;
- verification script passes;
- the destination adapter used the verified release artifact;
- release evidence records hashes/status without raw secrets.

If any item is missing, report `completed-but-not-verified` or `blocked`, never `verified`.