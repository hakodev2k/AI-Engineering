# Workflow: Cache Invalidation Safety Gate

## Trigger
Run when a change adds or modifies cached reads, durable mutations to cached data, cache keys/namespaces, invalidation logic, TTL behavior, or cache refresh jobs.

## Entry conditions
- Repository root is available.
- Intended change scope is known.
- Relevant cache behavior can be inspected without production mutation.

## Inputs
Task intent, changed files/diff, cache configuration, relevant tests, and expected consistency behavior.

## Context
Use `skills/cache-invalidation-review.md`, `rules/cache-safety.md`, `config/cache-gate.yaml`, the schema, scanner, validator, and the two subagent definitions.

## Stages
1. **Scope** — Workflow owner identifies changed mutation/cache boundaries and approval-sensitive operations.
2. **Investigate** — Cache Investigator maps keys, reads, writes, invalidation fan-out, consistency expectations, and uncertainty.
3. **Static gate** — Run `python3 scripts/scan-cache-risk.py <repo-root> --json`; preserve output.
4. **Plan** — Define the smallest safe implementation and targeted tests. Stop if the plan requires an approval-boundary action.
5. **Implement** — Implementation owner changes only the necessary application/test code.
6. **Test** — Run relevant unit/integration tests and build/static checks. Include post-mutation reads and applicable race/failure cases.
7. **Assess** — Produce assessment JSON matching `schemas/cache-assessment.schema.json`.
8. **Validate contract** — Run `python3 scripts/validate-assessment.py <assessment.json>`.
9. **Independent verify** — Cache Verifier reviews evidence, diff, tests, scanner result, and assessment.
10. **Complete or recover** — Complete only on verified `pass`; otherwise enter bounded fix/retest or stop/escalate.

## Responsible agents
- Investigation: `subagents/cache-investigator.md`.
- Implementation: repository implementation owner/agent, separate from sole verification ownership.
- Verification: `subagents/cache-verifier.md`.

## Tools
Repository read/search/edit tools, local build/test tools, and package scripts. Production cache mutation is not an allowed verification tool.

## Produced artifacts
- Scanner output.
- Investigation evidence/handoff.
- Source/test diff when required.
- Cache assessment JSON.
- Verification result and remaining risks.

## Checkpoints
- After investigation: every relevant mutation is mapped or marked inconclusive.
- Before implementation: no unapproved dangerous action is in the plan.
- After tests: results are preserved, including failures.
- Before completion: assessment validator and independent verifier both pass.

## Retry rules
Maximum fix/retest attempts: **2**.

Retryable failures:
- Targeted test/build failure caused by the proposed implementation.
- Incorrect or incomplete invalidation discovered by verifier.
- Assessment contract validation errors that can be corrected without changing the underlying evidence.

Evidence preserved on every attempt:
- Failed command/output.
- Scanner result.
- Diff at failure point.
- Verifier finding that triggered retry.

Escalation:
- After two failed fix/retest attempts, stop with `blocked` or `fail` and preserve evidence.
- Permission/environment failures may be retried once if clearly transient; otherwise stop as `blocked`.

Stop condition:
No loop may exceed the limits above.

## Approval points
Stop and request explicit human approval before production cache flush/reset, shared cache namespace change, production configuration change, breaking API contract, destructive data action, infrastructure change, or other actions listed in `config/cache-gate.yaml`.

## Failure paths
- Missing cache ownership/consistency contract → `inconclusive`.
- Scanner high-risk broad flush → `fail` unless removed or explicitly approved where appropriate; production execution remains forbidden.
- Required production-only verification → `blocked`; propose a safe non-production verification path.
- Failed relevant tests after retry budget → `fail`.
- Missing approval → `needs-approval`.

## Definition of Done
- Changed mutation/cache relationships are mapped.
- Cache key scope and consistency expectation are explicit.
- Required source/test changes exist and are minimal.
- Relevant tests/build checks pass.
- Assessment validates successfully.
- Independent verifier returns `pass`.
- No approval-required action is pending.
- Remaining non-blocking risks are documented.
