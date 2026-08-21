# Subagents

## Retry Evidence Analyst
**Mission:** Reconstruct retry amplification from runtime traces.  
**Responsibility:** Group physical attempts into logical operations; identify duplicate/no-progress sequences and retry layers.  
**Inputs:** JSONL trace, policy, operation taxonomy.  
**Required context:** Runtime event schema and known SDK retry behavior.  
**Allowed tools:** Read-only trace/config access, analyzer script.  
**Forbidden actions:** Changing production retry settings or replaying operations.  
**Expected output:** Baseline metrics and candidate retry owners.  
**Completion criteria:** Totals reconcile with raw trace and hotspots are evidence-linked.  
**Handoff:** Reliability Planner.

## Reliability Planner
**Mission:** Design bounded retry ownership and circuit policies.  
**Responsibility:** Classify errors, choose retry owner, define budgets/backoff/idempotency/checkpoint rules.  
**Inputs:** Baseline report, business side-effect taxonomy, provider constraints.  
**Required context:** Operation semantics and acceptable latency/recovery trade-offs.  
**Allowed tools:** Policy/config editing and local deterministic validation.  
**Forbidden actions:** Weakening auth/security or marking non-idempotent operations safe without evidence.  
**Expected output:** Proposed policy and rollout thresholds.  
**Completion criteria:** Every operation family has bounded retry semantics.  
**Handoff:** Implementation Agent.

## Implementation Agent
**Mission:** Integrate retry guard into the orchestration boundary.  
**Responsibility:** Emit fingerprints/events, call deterministic decision gate, persist state, wire circuit outcomes and checkpoints.  
**Inputs:** Approved policy and integration guide.  
**Required context:** Runtime lifecycle and tool execution boundary.  
**Allowed tools:** Code editing/build/test tools.  
**Forbidden actions:** Self-approving destructive replay; bypassing retry guard when it blocks.  
**Expected output:** Implementation plus changed-path list and test evidence.  
**Completion criteria:** Integration tests pass and telemetry contains required fields.  
**Handoff:** Independent Verification Agent.

## Independent Verification Agent
**Mission:** Verify retry storms are bounded without harming transient recovery.  
**Responsibility:** Run fixtures, compare baseline/guarded metrics, inspect side-effect protection and watchdog behavior.  
**Inputs:** Implementation, policy, baseline, tests.  
**Required context:** Expected transient/permanent failure behavior.  
**Allowed tools:** Read-only code review, test/benchmark execution.  
**Forbidden actions:** Silently changing thresholds to make tests pass.  
**Expected output:** Implemented/Measured/Verified report with regressions and blockers.  
**Completion criteria:** Required tests pass and claimed improvements have measured evidence.  
**Handoff:** Orchestrator.

## Orchestrator
**Mission:** Enforce handoffs, bounded remediation, and final stop conditions.  
**Responsibility:** Maintain retry-state ownership, prevent duplicate retry layers, request human approval when required.  
**Inputs:** All agent outputs.  
**Allowed tools:** Workflow control and approved runtime actions.  
**Forbidden actions:** Unlimited remediation or resetting retry budgets through respawn.  
**Expected output:** Continue, complete, blocked, or escalated decision.  
**Completion criteria:** Verification passes or bounded failure is reported accurately.