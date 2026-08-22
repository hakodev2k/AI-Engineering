# Workflow: Agent Artifact Integrity Gate

## Trigger
A workflow stage produces an artifact that another agent/stage will consume, persist, resume from, or use for a high-trust decision.

## Entry conditions
- Current task ID is known.
- Repository identity is known.
- Artifact policy is available.
- Producer can identify the artifact path and type.

## Inputs
- Artifact path
- Artifact type
- Producer identity/status
- Task ID
- Repository ID/ref
- Source artifact IDs
- Intended consumer stage

## Context
Use only the repository/task metadata needed for provenance and the source records needed for lineage verification.

## Stages

### 1. Produce
**Owner:** Artifact Producer

Finalize the stage artifact and record unresolved limitations.

**Artifact:** output file.

**Checkpoint:** file exists and producer status is truthful.

### 2. Register
**Owner:** Artifact Producer

Run:
```bash
python scripts/register-artifact.py --artifact <path> --record <record.json> --task-id <task> --repository-id <repo> --producer <agent> --artifact-type <type> --ttl-hours <n>
```
Add source artifact IDs when applicable.

**Artifact:** integrity record with `integrity_status=registered`.

**Checkpoint:** registration exits 0.

### 3. Deterministic sanity verification
**Owner:** Artifact Producer

Run `scripts/verify-artifact.py` to catch obvious path/hash/policy errors. This does not independently promote trust.

**Retry:** one retry only for transient filesystem errors.

### 4. Independent verification
**Owner:** Integrity Verifier

Recompute hash, evaluate freshness, task/repository binding, producer status and lineage. If all required checks pass, record verifier evidence and set decision `verified`.

**Revision loop:** at most 2 producer revisions when the verifier returns actionable provenance/record issues. A changed artifact must receive a new artifact ID/version and hash.

### 5. Consumer admission
**Owner:** downstream workflow gate

Before semantic use, rerun `scripts/verify-artifact.py` with current task/repository context. For high-trust stages, require recorded independent verification.

**Decisions:**
- `admit`: proceed.
- `reverify`: pause and route to Integrity Verifier.
- `reject`: stop downstream work.

### 6. Ledger validation
**Owner:** deterministic hook

Run `scripts/check-artifact-ledger.py` over the ledger directory to identify expired, broken-lineage, duplicate-ID, missing-file, or hash-mismatch records.

### 7. Complete
The workflow is complete only when the intended consumer has an admissible artifact or a blocking integrity result is explicitly reported.

## Approval points
Human approval is required to override a blocking integrity decision, reuse an artifact across a different task/repository, or allow a high-trust consumer to use an unverified artifact. Approval does not make an invalid hash valid; hash mismatch always requires regeneration/re-registration.

## Failure paths
- Missing file: stop.
- Hash mismatch: reject; regenerate or re-register changed bytes.
- Expired artifact: regenerate or independently reverify according to policy; never edit timestamp only.
- Missing source lineage: producer revision, maximum 2.
- Failed/blocked producer: reject.
- Tool/filesystem transient error: retry once.
- Repeated verifier rejection after 2 revisions: escalate with evidence and stop.

## Evidence preserved
Artifact record, verification output, source IDs, timestamps, hash values, and blocking reasons.

## Definition of Done
- Artifact exists.
- Record is valid.
- Current bytes match registered hash.
- Scope and freshness pass.
- Required lineage is valid.
- High-trust consumers have independent verification.
- Ledger check has no blocking violation for the artifact.
- Remaining risks are recorded.

`Task executed` means the producer created the artifact. `Task verified successfully` means the artifact passed the integrity gate for its intended consumer.