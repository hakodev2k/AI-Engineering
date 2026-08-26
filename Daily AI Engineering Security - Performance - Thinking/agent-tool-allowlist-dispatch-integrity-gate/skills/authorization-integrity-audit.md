# Skill — Authorization Integrity Audit

## Purpose
Prove that configured/request-visible capability restrictions are enforced at every runtime dispatch path.

## Trigger
New tool registry, new subagent type, framework upgrade, alternate transport/lane, or any report that an unadvertised capability executed.

## Inputs
Capability registry, request-scoped allowlist, delegation policy, dispatcher code paths, representative traces, test fixtures.

## Preconditions
A known set of principals and privileged capabilities; read-only access to configuration and code.

## Required context
Only the authorization model, dispatch paths, and affected request types.

## Allowed tools
Repository search, static inspection, test runner, `scripts/dispatch_guard.py`.

## Constraints
Do not invoke destructive capabilities. Never place credentials in fixtures. The audit may tighten authority but must not broaden it to make tests pass.

## Procedure
1. Enumerate every path that can resolve and execute a tool/subagent.
2. Record where capability discovery occurs and where authorization occurs.
3. For each lane, create one negative fixture naming a globally registered but request-hidden capability.
4. Check nested delegation: child effective scope must be a subset of parent scope.
5. Detect any resolver fallback after request-local lookup failure.
6. Run the deterministic gate and framework-native tests.
7. Record Facts, Evidence, Assumptions, Findings, Risk, Verification status.

## Decision points
Any path that can execute before the final allowlist check is blocking. Any missing principal/scope propagation is blocking for privileged capabilities.

## Expected output
A path-by-path authorization matrix plus reproducible failing/passing fixtures.

## Metrics
Dispatch-path coverage, negative-fixture block rate, delegated-scope subset rate, unauthorized execution count.

## Verification
Independent reviewer reproduces the negative fixtures and confirms all dispatch paths converge on enforcement.

## Failure handling
Maximum two implementation revisions. If a privileged path cannot be proven fail-closed, disable that path or remove the privileged capability pending review.

## Stop conditions
Stop immediately on secret exposure, production mutation, or evidence that authorization can be widened without an explicit owner decision.
