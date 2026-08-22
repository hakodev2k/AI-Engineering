# Skill: Acceptance and Ready Decision
**Trigger:** backlog item proposed for implementation or delivered item proposed for acceptance.
**Inputs:** problem/outcome, rules, edge cases, UX/API contracts, dependencies, tests/evidence.
**Procedure:** 1) define observable acceptance criteria; 2) include negative/edge behavior; 3) confirm dependencies and non-goals; 4) verify decision owner; 5) run Ready gate; 6) after delivery, inspect evidence criterion by criterion; 7) accept, reject or conditionally accept with explicit residual risk.
**Constraints:** do not require internal architecture unless it is itself a product/security constraint.
**Output:** Ready/Not Ready or Accepted/Rejected decision with evidence.
**Verification:** another reviewer can determine pass/fail from the criteria.
**Failure:** ambiguity -> return to owner with exact unresolved decision.
**Stop:** two failed refinement loops -> escalate.