# Agent Authority Freshness Decision Gate

**Category:** Thinking  
**Run date:** 2026-08-30 (UTC+7)

## Problem
Persistent and long-running agents can act on stale memories, failed-session beliefs, old summaries, backups, or self-generated assertions instead of current authoritative state. This causes scope drift, incorrect configuration/repository actions, false completion claims, and repeated operator correction.

## Evidence
See `evidence/research.md`. Public 2026 reports across Hermes Agent, Gemini CLI, Paperclip, and OpenClaw show stale-memory authority failures, stale-session resume errors, workflow-state loss, unsupported completion claims, and agents falling behind current state.

## Existing approach
Session resume, memory, plan summaries, human approvals, runbooks, and ad-hoc fresh tool reads are common.

## Existing limitations
They do not consistently encode which source is authoritative for each mutable fact, how fresh that fact must be, what approval actually covers, or whether a resumed belief survived a failed run. The model can also accidentally promote its own prose from assumption to apparent authorization.

## Proposed improvement
Require a structured decision artifact and a deterministic pre-decision authority/freshness gate. Critical facts must cite current evidence, authority, timestamp, and source version/fingerprint. Memory can propose what to verify but cannot override a stronger current source. Revalidation is bounded and high-impact decisions receive independent verification.

## Architecture
```text
README.md
config/authority-registry.example.json
evidence/research.md
skills/evidence-authority-revalidation.md
rules/decision-reliability-rules.md
subagents/decision-verifier.md
workflows/decide-revalidate-verify.md
hooks/pre-decision-authority-check.md
scripts/authority_freshness_gate.py
tests/test_authority_freshness_gate.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Copy `config/authority-registry.example.json`. Define each canonical source's authority rank, whether its facts are mutable, maximum age, and actions for which it is required. Keep memory/history lower authority than current policy/runtime/user-approval sources for mutable state.

## Usage
Create `decision.json` containing `action_type`, `impact`, `approval`, `facts`, `assumptions`, `hypotheses`, `decision`, `risks`, and `verification_status`. Critical facts include source/evidence/timestamp and, where possible, observed/current source versions.

```bash
python scripts/authority_freshness_gate.py decision.json --registry config/authority-registry.example.json --json-out decision-gate-report.json
python -m unittest tests/test_authority_freshness_gate.py
```

Exit codes: `0=allow`, `2=revalidate`, `3=block`, `1=input/runtime failure`.

## Workflow
Follow `workflows/decide-revalidate-verify.md`: **Observe → baseline → diagnose → hypothesis → structured decision → gate → bounded revalidation → execute → measure → independent verification**.

## Metrics
- authoritative evidence coverage;
- stale critical facts/task;
- unsupported conclusion rate;
- approval-scope violations;
- revalidation attempts/task;
- rework/rollback rate caused by stale assumptions;
- independent verification coverage.

## Verification
**Implemented:** decision record and gate integrated before protected actions.  
**Measured:** baseline and after-change failure metrics captured on the same representative cases.  
**Verified:** stale/weak facts are rejected or refreshed, approval scope is preserved, completion claims match current state, revalidation stays bounded, and a separate verifier approves high-impact results.

## Safety
The package does not request or expose hidden chain-of-thought. It verifies observable evidence artifacts only. Missing canonical access is not permission to trust memory. Dangerous or irreversible actions still require explicit human approval where policy requires it.

## Failure handling
Detection: gate violations, stale/missing evidence, source-version mismatch, authority conflict, missing approval, or independent-verification failure. Retry only targeted source revalidation, maximum two attempts by default. Fallback is no mutation; preserve evidence and escalate. Do not weaken correctness, approval, or authority thresholds to escape a blocker.

## Definition of Done
Evidence documented; baseline captured; authority registry configured; critical facts structured; limitations/root cause identified; gate integrated; tests pass; before/after metrics collected; revalidation bounded; approval preserved; risks documented; independent verification complete; no blocking authority/freshness issue remains.

## Customization
Adapters may populate source versions from Git commit SHAs, database revisions, ETags, configuration hashes, ticket update IDs, or API timestamps. Keep authority and freshness explicit and machine-checkable rather than relying on prompt wording alone.
