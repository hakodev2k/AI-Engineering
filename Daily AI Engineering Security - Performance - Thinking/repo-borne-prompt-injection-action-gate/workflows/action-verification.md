# Workflow: Side-Effect Action Verification

## Trigger
Immediately before an action influenced by repository-origin context could write, execute, publish, deploy, push, send network data, or read credentials.

## Goal
Bind each sensitive action to trusted user authorization and reject authority derived from repository data.

## Inputs
Serialized guard event, policy, user request, destination provenance, proposed tool/action.

## Baseline
Known authorized action classes and trusted destinations for the task.

## Stages
1. Capture source/path/content provenance.
2. Normalize the proposed tool call to an action class.
3. Determine whether the action class is explicitly authorized by the user request.
4. Determine whether destination/critical arguments came from untrusted content.
5. Run the deterministic guard.
6. If blocked, cancel the tool call and preserve reason codes.
7. If allowed, execute under existing sandbox/least-privilege restrictions.
8. Record result and hand high-risk cases to independent review.

## Responsible agent
Orchestrator performs stages 1–7; security reviewer audits stage 8.

## Tools
`python scripts/repo_provenance_guard.py --event <event.json> --policy config/policy.json`, tool permission layer, sandbox.

## Outputs
Allow/block decision, provenance, reason codes, execution receipt when allowed.

## Checkpoints
Before destination resolution, before credentials are accessed, and immediately before side effect execution.

## Metrics
Authorization coverage, blocked untrusted destinations, blocked credential reads, adversarial fixture block rate, benign pass rate.

## Retry policy
A blocked action is not automatically retried. One human-authorized reformulation is allowed only if it creates a new trusted authorization or trusted destination.

## Stop conditions
Missing provenance, missing explicit authorization, untrusted-derived destination, untrusted-triggered credential read, or guard error.

## Failure path
Fail closed, keep repository content available for analysis, disable only the blocked side effect, and escalate if the task cannot proceed safely.

## Verification
Reviewer confirms the executing agent did not grant itself authority and no secret was exposed.

## Definition of Done
Sensitive actions are bound to explicit trusted authorization, adversarial fixtures are blocked, benign data use works, logs are secret-free, and independent security verification passes.
