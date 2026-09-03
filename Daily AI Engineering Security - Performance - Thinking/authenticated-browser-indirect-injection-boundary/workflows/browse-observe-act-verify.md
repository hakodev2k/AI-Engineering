# Workflow: Browse → Observe → Act → Verify

## Trigger
An agent wants to perform a browser action in a session that may be authenticated.

## Goal
Preserve useful automation while preventing untrusted content from silently exercising ambient user authority.

## Inputs
Current page/source origin, target origin, action, authentication state, provenance, policy.

## Baseline
Record existing browser capabilities, authenticated origins, action classes, and current approval behavior before changing enforcement.

## Context
Facts: observable origin/auth/action metadata. Assumptions are explicit and cannot authorize actions.

## Stages
1. **Observe** untrusted content without increasing privilege.
2. **Classify** source origin and content provenance.
3. **Form intent** from user-approved task, not page instructions.
4. **Classify action** and target origin.
5. **Evaluate** `browser_action_guard.py`.
6. **Approve**: if policy requires, obtain human approval scoped to action + origin.
7. **Execute** only after ALLOW.
8. **Verify** actual target/result and detect redirects or origin drift.
9. **Audit** metadata without credentials.

## Responsible agent
Browser coordinator; Security Verifier independently validates policy behavior.

## Tools
Browser adapter, policy guard, origin parser, isolated test fixtures, audit logger.

## Outputs
Decision record, action result, verification status.

## Checkpoints
Before any sensitive action and after navigation/redirect that changes origin.

## Metrics
Blocked malicious transitions, sensitive-action approval coverage, origin-drift detections, test pass rate.

## Retry policy
One automatic re-evaluation only when metadata changed legitimately. Never retry a blocked action by changing trust labels without new evidence.

## Stop conditions
Verified permitted action; policy block; origin drift; approval denied; missing provenance.

## Failure path
Fail closed, preserve audit-safe evidence, and return control to the human/operator.

## Definition of Done
Required metadata present; policy permits action; approval present if required; target origin verified; adversarial regression suite passes; independent verifier approves.
