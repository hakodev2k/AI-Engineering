# Workflow: Research and Diagnose Repository-Borne Injection

## Trigger
A new untrusted repository/work item is introduced, a suspicious instruction appears in project content, or a side effect is proposed after reading repository-controlled data.

## Goal
Determine whether repository content can cross from data into authority and identify the smallest enforceable trust-boundary correction.

## Inputs
User task, repository/context sources, tool inventory, authorization policy, proposed action/destination, guard output.

## Baseline
Record which sources currently enter context, which tools are exposed, which action classes the user explicitly requested, and whether provenance survives to tool-call time.

## Stages
1. **Observe** — inventory untrusted sources and sensitive tools.
2. **Measure baseline** — run benign and adversarial events through the current integration.
3. **Diagnose** — locate where provenance or explicit authorization is lost.
4. **Form hypothesis** — state one root cause, such as destination provenance loss or implicit authorization.
5. **Implement improvement** — add/adjust deterministic provenance/action gate; preserve sandbox/least privilege.
6. **Measure again** — rerun the same fixtures.
7. **Independent verify** — security reviewer confirms attack paths are blocked and benign context remains usable.

## Responsible agent
Implementation agent owns stages 1–6; `subagents/security-reviewer.md` owns stage 7.

## Tools
Read-only repo inspection, `scripts/repo_provenance_guard.py`, test runner, sandbox/permission inspection.

## Outputs
Trust-boundary map, root cause, guard decision evidence, before/after fixture results, reviewer decision.

## Checkpoints
After baseline; before modifying authorization semantics; before enabling any side-effect tool; at final review.

## Metrics
Attack block rate, benign pass rate, explicit authorization coverage, untrusted-destination blocks, credential-read blocks, false-positive review count.

## Retry policy
Maximum one implementation correction followed by one complete rerun.

## Stop conditions
Any real secret exposure, production write, missing provenance, unresolved destination authority, failed adversarial fixture, or failed retry.

## Failure path
Disable side-effecting tools for untrusted repository contexts and escalate. Never compensate by weakening isolation or approvals.

## Verification
Independent reviewer must reproduce fixture results and confirm no secret material was used.

## Definition of Done
Evidence documented; limitation/root cause identified; gate integrated; security tests pass; benign data remains available; attack path blocked; permissions preserved; independent verification complete.
