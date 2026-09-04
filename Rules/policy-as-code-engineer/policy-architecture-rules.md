# Policy Architecture Rules

## Purpose
Establish architectural boundaries for production policy-as-code systems so policy decisions remain explicit, testable, secure, explainable, and operationally controllable.

## Scope
Applies to policy engines, policy repositories, decision services, embedded evaluators, admission controllers, CI/CD gates, authorization policy, infrastructure policy, and policy distribution mechanisms.

## MUST
- Policy evaluation MUST be separated from application business logic through an explicit decision boundary unless embedding is justified by latency or availability requirements.
- Every policy domain MUST define its decision inputs, outputs, authoritative data sources, enforcement point, and failure behavior.
- Policy engines MUST be treated as security-sensitive infrastructure when decisions affect access, deployment, configuration, data exposure, or production changes.
- Policy dependencies and data flows MUST be documented sufficiently to identify trust boundaries and blast radius.
- Policy distribution MUST provide deterministic version identity so a decision can be traced to the exact policy set that produced it.
- Architecture changes MUST assess availability, latency, consistency, security, rollback, and compatibility impacts before production adoption.

## MUST NOT
- Policy enforcement MUST NOT depend on undocumented side effects or hidden shared state.
- Applications MUST NOT silently implement shadow policy logic that can diverge from the governed policy source.
- A policy engine outage MUST NOT implicitly become an allow-all condition unless an explicitly approved fail-open design exists for that decision class.
- Derived policy bundles MUST NOT become the sole source of truth when they can be rebuilt from authoritative policy sources.

## SHOULD
- Decision interfaces SHOULD be stable across policy implementation changes.
- High-risk policy domains SHOULD isolate policy authoring, policy approval, and policy deployment responsibilities.
- Policy architecture SHOULD support canary evaluation and rollback without requiring application redeployment where practical.

## Exceptions
Exceptions require documented context, alternatives considered, risk, evidence, rollback strategy, and approval from the accountable technical or security owner when controls are weakened.

## Verification
Review architecture diagrams, decision contracts, dependency graphs, trust boundaries, policy bundle metadata, failure-mode tests, deployment topology, and trace evidence. Verify that any given production decision can be tied to a known policy version and enforcement point.