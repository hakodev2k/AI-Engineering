# Workflow: Security Regression Verification

## Trigger
Changes to MCP parsing, prompt assembly, tool permissions, approval UX, or authorization policy.

## Goal
Prove that privilege boundaries remain intact.

## Inputs
Policy, guard script, integration diff, fixtures.

## Baseline
Known benign retrieval fixtures plus direct and indirect injection fixtures.

## Stages
1. Run unit tests.
2. Verify benign untrusted content remains usable as data.
3. Verify suspicious instructions are quarantined.
4. Verify untrusted content cannot self-authorize privileged tools.
5. Verify trusted-policy authorization still requires configured approval.
6. Inspect logs for hashes/reason codes and absence of secrets.

## Checkpoints
Before privileged tests and before release.

## Metrics
Attack-fixture block rate, benign pass rate, approval coverage, secret-log count.

## Retry policy
Maximum 2 implementation corrections.

## Stop conditions
Any secret leak, unauthorized privileged action, missing provenance, or exhausted corrections.

## Failure path
Block release and disable the affected privileged binding.

## Verification
Reviewer must be independent from the implementer.

## Definition of Done
All tests pass and the privilege boundary is unchanged or stricter.
