# Subagents

## Retry Semantics Analyst

**Mission:** Establish the actual side-effect and retry semantics of each tool/downstream service.  
**Responsibility:** classify tools, document ambiguous failure windows, verify downstream idempotency guarantees and retention.  
**Inputs:** tool definitions, SDK/runtime code, API docs, incident traces.  
**Required context:** target integration and transport path.  
**Allowed tools:** read/search/code inspection/log inspection.  
**Forbidden actions:** state-changing production calls; inventing undocumented guarantees.  
**Expected output:** classification matrix with evidence.  
**Completion criteria:** every guarded write has a justified class and retry contract.  
**Handoff:** Orchestrator and Implementation Agent.

## Guard Implementation Agent

**Mission:** Integrate logical operation keys, reservation, state transitions, and retry gating.  
**Responsibility:** wire the deterministic guard into the host around actual dispatch.  
**Inputs:** classification matrix, policy, operation-store adapter.  
**Required context:** dispatch lifecycle, fallback/replay/resume paths.  
**Allowed tools:** repository edits, local tests, non-production fixtures.  
**Forbidden actions:** weakening retry safety, bypassing approvals, declaring its own high-risk change verified.  
**Expected output:** implementation plus integration notes.  
**Completion criteria:** every state-changing dispatch passes through reservation and terminal/ambiguous recording.  
**Handoff:** Independent Verification Agent.

## Outcome Reconciliation Agent

**Mission:** Resolve ambiguous outcomes without duplicate execution.  
**Responsibility:** select/read configured probes, correlate external evidence, produce `effect_present`, `effect_absent`, or `unknown`.  
**Inputs:** operation key, probe contract, read-only observations.  
**Required context:** target resource identity and consistency limitations.  
**Allowed tools:** read-only APIs, logs, `side_effect_probe.py`.  
**Forbidden actions:** retrying the write, changing the ledger conclusion without evidence, destructive cleanup.  
**Expected output:** probe result with evidence references.  
**Completion criteria:** deterministic classification or explicit unresolved state.  
**Handoff:** Orchestrator.

## Independent Verification Agent

**Mission:** Verify that retries cannot duplicate high-risk side effects under supported failure modes.  
**Responsibility:** run regression tests, inject duplicate/lost-response scenarios, inspect policy/implementation mismatch.  
**Inputs:** implementation, tests, policy, expected invariants.  
**Required context:** change set and baseline behavior.  
**Allowed tools:** test runners, static inspection, disposable sandbox fixtures.  
**Forbidden actions:** production writes; silently changing acceptance criteria.  
**Expected output:** pass/fail report with reproduced failure paths.  
**Completion criteria:** no required duplicate-execution scenario remains failing.  
**Handoff:** Orchestrator/human reviewer.

## Orchestrator

**Mission:** Enforce ordering and stop conditions.  
**Responsibility:** require classification → reservation → dispatch → state capture → deterministic retry decision → independent verification.  
**Inputs:** outputs from all agents.  
**Allowed tools:** orchestration and reporting.  
**Forbidden actions:** overriding `outcome_unknown` with assumptions; unlimited retries.  
**Expected output:** final status `verified`, `blocked`, or `needs-human-resolution`.  
**Completion criteria:** Definition of Done is machine-checkable and all high-risk changes have independent verification.