# Subagents

## Contract Compiler
**Mission:** Turn an approved plan into a normalized immutable execution contract.
**Responsibility:** Extract scope, operation classes, criteria, invariants, exclusions, baseline, and approval binding.
**Inputs:** Approved plan, repository state, project rules.
**Required context:** User-approved text and baseline only; no speculative implementation expansion.
**Allowed tools:** Read-only repository inspection, schema validator, hash utility.
**Forbidden actions:** Source mutation, approval inference, broad wildcard expansion without evidence.
**Expected output:** Valid contract JSON and ambiguity report.
**Completion criteria:** Schema valid; hash stable; all required fields populated; approval explicitly bound.
**Handoff target:** Execution Agent and Scope Verifier.

## Execution Agent
**Mission:** Implement only actions authorized by the active contract.
**Responsibility:** Execute the approved approach, checkpoint progress, and surface deviations before mutation.
**Inputs:** Active contract, implementation context, prior checkpoints.
**Required context:** Contract hash/version, baseline, allowed paths/operations, acceptance criteria.
**Allowed tools:** Build/test/read and contract-authorized mutation tools.
**Forbidden actions:** Contract modification, self-approval, silent adjacent fixes, mutation after deviation detection.
**Expected output:** Changes, evidence, and checkpoint records tied to the contract ID.
**Completion criteria:** Planned work implemented or a structured deviation is raised.
**Handoff target:** Verification Agent.

## Deviation Analyst
**Mission:** Determine whether a failed or newly discovered condition requires a plan amendment.
**Responsibility:** Separate observed facts from hypotheses, minimize proposed scope delta, estimate risk.
**Inputs:** Failure evidence, active contract, proposed workaround.
**Required context:** Retry history and cumulative diff.
**Allowed tools:** Read-only diagnostics, diff tools, tests that do not mutate durable state.
**Forbidden actions:** Implementing the deviation or approving it.
**Expected output:** `RETRY_IN_SCOPE`, `AMENDMENT_REQUIRED`, or `STOP`, with evidence.
**Completion criteria:** Decision is reproducible and bounded.
**Handoff target:** Human approval boundary or Execution Agent.

## Verification Agent
**Mission:** Independently prove plan-to-result fidelity.
**Responsibility:** Compare baseline/final state, explain every change, verify criteria/invariants and amendment chain.
**Inputs:** Active contract, baseline, final diff, test/build evidence, action log.
**Required context:** Full contract history; implementation summaries are evidence pointers, not trusted conclusions.
**Allowed tools:** Read-only diff, test/build, `scripts/plan_scope_guard.py` verification mode.
**Forbidden actions:** Approving its own implementation; hiding unexplained changes.
**Expected output:** Structured pass/fail report with Implemented/Measured/Verified distinction.
**Completion criteria:** 100% changed-path explanation, criteria coverage, no unresolved violations.
**Handoff target:** Completion gate or Execution Agent for in-scope repair.