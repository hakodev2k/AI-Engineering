# Workflow: Validate Before MCP Side Effect

## Trigger
Any configured MCP tool call before command, network, or filesystem side effects.

## Goal
Prove argument invariants before execution.

## Inputs
Tool-call envelope, policy, canonical-path preflight data where required.

## Baseline
Record currently allowed tool, argument classes, roots, hosts, and attached credential scope.

## Stages
1. Observe the tool call without executing it.
2. Map arguments to configured sink rules.
3. Run `scripts/mcp_arg_guard.py`.
4. If denied, do not mutate inputs to make them pass; return reason codes.
5. If allowed, execute under least privilege.
6. Measure and log outcome without secrets.
7. Run postcondition checks for changed files or external destinations.

## Responsible agent
Caller performs preflight; Security Verifier independently validates policy changes.

## Tools
Guard script, canonical path resolver, standard tests.

## Outputs
Allow or deny result, reason codes, sanitized audit record.

## Checkpoints
Before credentials attach, before process spawn, before filesystem operation.

## Metrics
Denied unsafe calls, unknown-tool denies, sink coverage, false positives, escaped-boundary count.

## Retry policy
At most one corrected call after an argument validation failure; no automatic weakening of policy.

## Stop conditions
Unknown tool, secret exposure risk, out-of-root canonical path, untrusted credential destination, repeated denial.

## Failure path
Disable affected tool and escalate.

## Verification
Independent regression workflow.

## Definition of Done
Guard permits only policy-compliant calls; unsafe fixtures remain denied; no secret exposure.
