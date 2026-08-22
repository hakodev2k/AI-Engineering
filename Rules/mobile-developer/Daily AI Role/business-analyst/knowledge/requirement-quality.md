# Requirement Quality Knowledge

A strong requirement explains **why** behavior matters and **what** observable result is required without prematurely forcing an implementation.

## Quality dimensions
- Necessary: linked to an objective, policy, risk, or validated user need.
- Unambiguous: materially different interpretations are not possible without an explicit open question.
- Testable: pass/fail can be observed.
- Traceable: source, owner, decision, and acceptance are linkable.
- Consistent: no conflict with approved requirements or a conflict is explicitly recorded.
- Scoped: includes boundaries and exclusions.
- Feasibility-aware: known technical/operational constraints are recorded without turning guesses into design mandates.

## Common failure patterns
Solution disguised as requirement; missing exception path; undefined actor; implicit timezone; ambiguous 'active/user/admin'; absent historical behavior; hidden manual step; no source for policy; acceptance that repeats the requirement without observable outcome.

## Review heuristic
For each rule ask: Who? Under what state? With what data? At what time? What if invalid? What if repeated/concurrent? What persists? What is visible? What is audited? Who decides exceptions?