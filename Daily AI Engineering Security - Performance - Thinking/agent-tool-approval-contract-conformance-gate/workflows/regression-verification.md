# Workflow: Regression Verification

## Trigger
Any change to tool definitions, approval handling, consequence classification, sandbox setup, or policy precedence.

## Goal
Prove central policy remains monotonic and attack paths are blocked.

## Inputs
Policy, effective tool manifest, tests, implementation diff.

## Baseline
Fixtures for safe read-only auto approval, safe high-risk explicit approval, weak auto-approved executor, and unsandboxed shell.

## Stages
1. Run unit tests.
2. Require safe read-only fixture to pass.
3. Require explicitly approved+sandboxed code execution to pass.
4. Require auto-approved code execution to block.
5. Require unsandboxed shell execution to block.
6. Export the actual runtime registry and re-run the gate.
7. Independently review approval-policy precedence.

## Responsible agent
Test agent executes; Security Reviewer signs off.

## Tools
Python unittest, gate script, registry exporter.

## Outputs
Test log, effective-policy report, reviewer decision.

## Checkpoints
After tests and before rollout.

## Metrics
Attack-fixture block rate, benign-fixture pass rate, high-risk coverage.

## Retry policy
One implementation correction followed by one full rerun.

## Stop conditions
Any approval bypass, missing required sandbox, or runtime/source mismatch blocks completion.

## Failure path
Disable affected tool and restore last verified policy.

## Verification
Implementer cannot be the only verifier.

## Definition of Done
All security fixtures pass and the effective registry conforms to central policy.
