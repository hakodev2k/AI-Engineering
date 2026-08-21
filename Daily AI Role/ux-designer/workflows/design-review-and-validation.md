# Workflow: Design Review and Validation

**Trigger:** a candidate flow/spec is ready for review or an existing design is being changed.
**Goal:** identify material risk before implementation/release.
**Inputs:** versioned candidate, problem frame, evidence, risk level, constraints.
**Preconditions:** candidate is stable enough to evaluate.

1. Freeze review version and open questions.
2. Run accessibility, interaction-consistency, research-evidence, and usability-risk lanes in parallel.
3. Consolidate duplicate/conflicting findings by underlying user consequence.
4. Rank by severity, evidence strength, reversibility, and dependency impact.
5. Resolve high/critical findings or route to authorized acceptance/escalation.
6. Run usability evaluation for unresolved high-uncertainty/high-impact hypotheses.
7. Re-review only changed areas plus regression-critical paths.
8. Record decisions and residual risk.

**Bounded retry:** at most two review-redesign cycles for the same blocking issue before escalation.

**Failure:** if evidence or authority is unavailable, mark blocked; do not infer approval.

**DoD:** critical findings resolved/accepted, regression risks checked, decision record complete, validation evidence available.
