# Workflow: Research and Diagnose
**Trigger:** suspected MCP stdio command-policy weakness.  
**Goal:** prove whether partial command authorization can become code execution.

## Inputs
Current MCP configuration, spawn path, approval behavior, advisory evidence.

## Baseline
Capture accepted executable names, argv handling, shell usage, and confirmation behavior.

## Stages
1. Observe current launch representation.
2. Measure how much of the invocation is authorized.
3. Diagnose shell or wrapper re-parsing.
4. Form a single explicit hypothesis.
5. Run deterministic benign/malicious fixtures without executing commands.
6. Revise the hypothesis at most twice.

## Checkpoints
Before fixture construction and before any policy exception.

## Metrics
Contract coverage, blocked malicious fixtures, exceptions, approval bypasses.

## Retry policy
Maximum 2 diagnostic revisions.

## Stop conditions
Any production execution request, secret exposure, or unresolved parsing ambiguity blocks completion.

## Failure path
Disable the affected server registration path.

## Verification
Independent Security Reviewer reproduces the result.

## Definition of Done
Evidence captured, root cause identified, deterministic pre-spawn block demonstrated.
