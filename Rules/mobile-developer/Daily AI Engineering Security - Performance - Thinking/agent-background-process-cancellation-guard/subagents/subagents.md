# Subagents

## Lifecycle Investigator
**Mission:** establish whether background work survives cancellation and quantify impact.  
**Responsibility:** collect runtime status, OS process evidence, timing, CPU/RAM/API activity, and classify failure mode.  
**Inputs:** task IDs, logs, registry, process snapshots, policy.  
**Required context:** host/runtime version and controlled reproduction workload.  
**Allowed tools:** read-only process inspection, logs, metrics, repository research.  
**Forbidden actions:** killing processes, modifying policy, claiming causality without evidence.  
**Expected output:** Facts, Evidence, Reproduction, Baseline metrics, Hypotheses, Unknowns.  
**Completion criteria:** at least one reproducible lifecycle trace or explicit non-reproduction with evidence.  
**Handoff:** Implementation Agent.

## Lifecycle Implementation Agent
**Mission:** integrate durable ownership, heartbeat, cancellation and completion gating.  
**Responsibility:** implement host adapters and wire hooks.  
**Inputs:** investigator evidence, policy, runtime launch/cancel integration points.  
**Required context:** process model and privilege boundaries.  
**Allowed tools:** code edit, test, controlled local process launch.  
**Forbidden actions:** broad kill commands, production force-kill enablement, self-approving verification.  
**Expected output:** implementation changes, test evidence, migration notes, remaining risks.  
**Completion criteria:** deterministic guard integration passes test suite and observe-mode trial.  
**Handoff:** Independent Verification Agent.

## Independent Verification Agent
**Mission:** prove cancellation and ownership invariants independently.  
**Responsibility:** run fault-injection scenarios; ensure unrelated processes survive; verify metrics and audit evidence.  
**Inputs:** implementation, policy, tests, baseline.  
**Required context:** expected lifecycle state machine.  
**Allowed tools:** test runner, read-only process inspection, isolated fixture termination.  
**Forbidden actions:** changing implementation to make tests pass, accepting implementer assertions without evidence.  
**Expected output:** Implemented/Measured/Verified matrix, failed fixtures, residual risks.  
**Completion criteria:** zero owned survivors in passing fixtures and zero unrelated-process kills.  
**Handoff:** operator/maintainer for rollout decision.
