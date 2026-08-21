# Solution Architecture Lifecycle Hooks

## Intake gate

**Trigger:** before solution analysis begins.

**Action:** confirm objective, scope, decision owner, current-state sources, functional requirements, critical NFRs, constraints, deadline, and approval boundaries.

**Failure behavior:** record missing inputs and stop design decisions that depend on them. Continue only reversible discovery.

## Pre-decision gate

**Trigger:** before recommending an architecture option.

**Action:** verify decision drivers, alternatives, trade-offs, trust/data boundaries, failure and recovery behavior, operational ownership, cost implications, evidence, and independent review for high-impact decisions.

**Failure behavior:** return the decision to analysis with named gaps and owners. Do not present an unsupported preference as the selected architecture.

## Pre-handoff gate

**Trigger:** before declaring the design complete.

**Action:** apply `checklists/definition-of-done.md`, resolve blocking review findings, record approvals, and confirm implementation plus verification owners understand the decision and residual risk.

**Failure behavior:** keep the design in review or blocked state and state the exact missing evidence, decision, approval, or owner.
