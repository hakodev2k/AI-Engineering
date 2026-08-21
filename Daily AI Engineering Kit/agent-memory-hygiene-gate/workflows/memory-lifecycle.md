# Workflow: Agent Memory Lifecycle

## Entry condition
A task produces a candidate durable fact/preference, or an agent is about to retrieve persisted memory.

## Required inputs
Candidate observation or retrieval query, evidence/source reference, current scope, memory policy, current time, existing memory directory.

## Stages

### 1. Candidate capture — Task Agent
Artifact: raw candidate + evidence pointer.
Checkpoint: candidate must be plausibly useful beyond the current task.

### 2. Admission analysis — Memory Curator
Use `skills/memory-admission.md`.
Artifacts: normalized candidate and conflict/duplicate list.
Checkpoint: one atomic claim, scope, provenance, observed time, confidence and expiry exist.

### 3. Deterministic validation — Hook/Script
Run `scripts/validate-memory.py`.
- Exit 0: continue.
- Policy violation: return to curator.
- Operational error: stop; never interpret script failure as approval.

### 4. Independent review — Memory Reviewer
Return `pass`, `revise`, or `blocked`.
- `revise`: curator may revise at most twice total.
- `blocked`: stop unless materially new evidence is supplied.
- unresolved contradiction: stop automatic persistence.

### 5. Human approval boundary — Human
Required if the proposed memory is intended to become a standing operational instruction affecting production, security, authorization, financial actions, infrastructure, destructive actions, secrets, or breaking contracts. Approval is scoped to the stated use and is not perpetual authority.

### 6. Persistence — Host Integration
Write only reviewer-approved records. Persistence mechanism is tool-specific and outside the core package.
Artifact: durable record matching schema.
Checkpoint: persisted file/content equals the reviewed record.

### 7. Retrieval preparation — Retrieval Hook
Before a future task uses memory, run `scripts/sweep-memory.py`.
Artifacts: active records, expired IDs, conflicts, invalid records.
Checkpoint: no unchecked memory is injected after operational failure.

### 8. Semantic retrieval — Task Agent / Memory Retrieval Skill
Use `skills/memory-retrieval.md` to select the smallest task-relevant subset. Fresh authoritative evidence beats memory.

### 9. Post-task maintenance
Any corrected or newly contradicted claim re-enters Stage 1 as a new candidate. Do not silently mutate historical facts without provenance.

## Retry rules
- Candidate revision: maximum 2.
- Transient source read: maximum 2 attempts.
- Validator/sweep operational failure: one immediate retry only if clearly transient; otherwise stop or continue without memory.

## Stop conditions
Stop persistence on forbidden data, missing provenance, unresolved contradiction, reviewer `blocked`, failed human approval, two failed revisions, or validator operational failure. Stop retrieval and continue without memory if safety cannot be established.

## Failure recovery
- Stale/expired: exclude, then re-observe before new admission.
- Duplicate: consolidate through a new reviewed candidate.
- Conflict: preserve both references and require evidence-based resolution.
- Corrupt record: quarantine from retrieval; do not auto-repair semantic content.

## Definition of Done
For persistence: validator passes, reviewer passes, required human approval exists, no unresolved conflict, and exact reviewed content is persisted.
For retrieval: sweep completes, records are active and scope-matching, fresh evidence was considered, and only a minimal verified set is injected.

`Task completed` is not `memory verified`: merely generating or saving a record does not satisfy this workflow.