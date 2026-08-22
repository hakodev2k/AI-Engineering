# Subagents

## Output Baseline Investigator

**Mission:** Build a measured picture of output growth before changes are proposed.  
**Responsibility:** Audit representative sessions, identify largest producers/duplicates, record disk/RSS/resume metrics.  
**Inputs:** Session files, tool logs, runtime telemetry.  
**Required context:** Workload classes and storage/session architecture.  
**Allowed tools:** Read-only file inspection, `session_bloat_audit.py`, metrics queries.  
**Forbidden actions:** Deleting artifacts, changing capture policy, terminating processes.  
**Expected output:** Baseline report with dominant sources and evidence.  
**Completion criteria:** At least one measurable bottleneck or explicit conclusion that evidence is insufficient.  
**Handoff target:** Output Budget Planner.

## Output Budget Planner

**Mission:** Convert baseline evidence into explicit soft/hard/rate/session budgets.  
**Responsibility:** Propose limits, workload classes, retention/reference strategy, and rollout thresholds.  
**Inputs:** Baseline report, business/verification requirements.  
**Required context:** Which outputs must remain fully retrievable.  
**Allowed tools:** Policy files, calculators, historical metrics.  
**Forbidden actions:** Raising limits to hide a failing regression; removing required evidence.  
**Expected output:** Versioned policy proposal with rationale and expected impact.  
**Completion criteria:** Every threshold is tied to measured data or an explicit safety ceiling.  
**Handoff target:** Integration Agent.

## Integration Agent

**Mission:** Insert capture/reference/backpressure controls into the runtime without changing tool semantics.  
**Responsibility:** Wire stream capture, counters, artifact persistence, session references, telemetry, and reason codes.  
**Inputs:** Approved policy, host tool-runner integration points.  
**Required context:** Process ownership, session serializer, artifact storage.  
**Allowed tools:** Repository edits, tests, local fixtures.  
**Forbidden actions:** Destructive artifact cleanup, unapproved process termination, weakening verification.  
**Expected output:** Integrated implementation plus measured local results.  
**Completion criteria:** All deterministic tests pass and no output is silently lost.  
**Handoff target:** Independent Performance Verifier.

## Independent Performance Verifier

**Mission:** Verify the guard independently from the implementer.  
**Responsibility:** Re-run large-output fixtures, compare before/after storage/RSS/resume metrics, inspect clipping/reference correctness.  
**Inputs:** Implementation, policy, baseline, fixture set.  
**Required context:** Success thresholds and known correctness-critical outputs.  
**Allowed tools:** Benchmarks, tests, session audit, read-only artifact inspection.  
**Forbidden actions:** Editing the implementation under review and then self-approving it.  
**Expected output:** Implemented/Measured/Verified verdict with blocking findings.  
**Completion criteria:** Budget gates pass, required evidence remains retrievable, and performance comparison is reproducible.  
**Handoff target:** Orchestrator/human owner.

## Orchestrator

**Mission:** Enforce bounded flow and stop conditions.  
**Responsibility:** Sequence baseline → plan → implementation → measurement → independent verification.  
**Inputs:** Agent handoffs and policy.  
**Required context:** Retry count, blocking findings, approvals.  
**Allowed tools:** Delegation and read-only status inspection.  
**Forbidden actions:** Unlimited retries, declaring success without verifier evidence, silently increasing budgets.  
**Expected output:** Final state: verified, blocked, or escalated.  
**Completion criteria:** Definition of Done is satisfied or a concrete blocking reason is recorded.  
**Handoff target:** Final caller.