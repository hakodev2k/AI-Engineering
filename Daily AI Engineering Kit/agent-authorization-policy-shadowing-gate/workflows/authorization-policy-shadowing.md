# Authorization Policy Shadowing Workflow

## Trigger
Authorization rule changes, access-control incidents, unexpected 403/200 behavior, IAM refactors, or pre-release security review.

## Entry conditions
Repository readable; policy scope identifiable; no production mutation required.

## Inputs
Policy sources, intended access behavior, tests, evaluation semantics.

## Stages
1. **Context — Policy Explorer:** locate entry points, rules, defaults and tests. Output normalized policy map.
2. **Semantics checkpoint:** confirm first-match evaluation. If not first-match, stop this deterministic gate and use platform-specific reasoning.
3. **Static gate — workflow owner:** run `scripts/policy_shadow_gate.py`.
4. **Review — Authorization Verifier:** validate each blocking finding against source evidence.
5. **Plan:** choose smallest safe correction and identify approvals.
6. **Approval checkpoint:** stop before removing deny rules, widening admin scope, changing default effect, or production changes.
7. **Execute:** apply approved repository-only change.
8. **Test:** targeted authorization tests plus existing affected suite.
9. **Re-run gate:** require zero unaccepted blocking findings.
10. **Final verification:** independent verifier checks diff, evidence and results.

## Produced artifacts
Normalized policy map, gate result JSON, test output, verification record.

## Retry rules
Transient command/I/O failure: maximum 2 retries. Preserve stderr, command, input hash and attempt number. Validation/test failures are not retried without a code/config change.

## Failure paths
Unknown semantics -> `needs-semantics-review`. Permission failure -> stop. Test failure -> return to plan once; after a second failed correction stop and escalate.

## Definition of Done
Semantics confirmed; blocking shadow findings resolved or approved; affected allow/deny tests pass; no unsafe scope expansion; verifier reports `verified`.