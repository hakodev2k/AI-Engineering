# Context Provenance Gate Workflow

## Trigger
Run before an AI agent plans or executes work using mixed repository, runtime, external, or human-provided context; rerun when material context changes.

## Entry conditions
Task objective and repository boundary are known. Read access is available to at least one authoritative source.

## Inputs
Task objective, acceptance criteria, candidate evidence, `config/trust-policy.json`.

## Flow
```text
Trigger
  ↓
Source Curator: discover + classify
  ↓
Gate: source validation
  ↓
Context assembly: claims + provenance
  ↓
Context Verifier: independent check
  ↓
Gate: final validation
  ↓
Verified handoff OR blocked escalation
```

## Stages
1. **Discover** — Source Curator inspects repository structure, relevant modules/tests, and only evidence needed for the task.
2. **Classify** — Curator records source IDs, type, location, authority, relevance, dynamic timestamp, and corroboration.
3. **Pre-check** — Run `python scripts/context_trust_gate.py <manifest> --policy config/trust-policy.json`.
4. **Assemble claims** — Apply `skills/context-assembly.md`; keep facts, hypotheses, decisions, and open questions separate.
5. **Independent verification** — Context Verifier spot-checks high-impact claims and provenance.
6. **Final gate** — Re-run the deterministic gate on the complete manifest.
7. **Handoff** — Only `verified` context may proceed to planning/implementation.

## Produced artifacts
A context manifest matching `schemas/context-manifest.schema.json` and deterministic verification results.

## Checkpoints
- After source discovery: at least one authoritative source.
- After claim assembly: all material claims cite known sources.
- Before handoff: final gate exits 0.

## Retry rules
Maximum 2 evidence-refresh retries. Retryable: stale dynamic evidence, temporarily unavailable read-only source, or missing corroboration that can be obtained without extra privilege. Preserve prior evidence and failure output. Permission failures and blocked-source findings are not automatically retried.

## Approval points
Stop for human approval before any production change, destructive action, privilege increase, secret change, security weakening, breaking contract, or irreversible migration. This workflow itself does not perform those actions.

## Failure paths
- Validation failure → return to Curator once with exact errors.
- Tool/transient read failure → retry at most twice.
- Permission failure → stop and report minimum required access.
- Conflicting material evidence → mark unresolved and stop handoff.
- Persistent gate failure → status `blocked` with preserved evidence.

## Definition of Done
The manifest is complete, final status is `verified`, gate exit code is 0, high-impact claims have valid provenance, blocked sources are absent, and unresolved risks are documented.
