# Lifecycle Hooks
## on-intake
Reject solution-first requests lacking a user/problem/outcome statement; create an assumptions list instead.
## before-prioritization
Require value, urgency, dependency, risk, reversibility and effort evidence at the available confidence level.
## before-ready
Block Ready when acceptance criteria, dependencies, owner or decision boundary are ambiguous.
## before-release
Require acceptance evidence, release scope, rollback/disable path for material risk and success signals.
## on-scope-change
Recompute impact, dependencies, acceptance criteria and release plan; never silently absorb scope.
## on-retry
Maximum two refinement/rework cycles before escalating unresolved ambiguity or authority conflict.
## on-completion
Verify evidence, update decision log, measurement owner and next review date. Hooks must be deterministic and idempotent where possible.