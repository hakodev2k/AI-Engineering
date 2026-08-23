# Containment Rules

## Purpose
Contain threats while minimizing avoidable business damage and evidence loss.

## Scope
Endpoint isolation, credential revocation, network blocking, account suspension, service restrictions, and related incident controls.

## MUST
- Containment actions MUST be proportional to credible threat, blast radius, asset criticality, and reversibility.
- High-impact actions MUST identify an accountable approver unless immediate action is required by an approved emergency playbook.
- Evidence required for root-cause analysis MUST be preserved when practical before destructive containment.
- Containment effectiveness MUST be verified after execution.

## MUST NOT
- MUST NOT perform broad destructive containment merely because scope is uncertain.
- MUST NOT assume a control succeeded without checking resulting state and telemetry.

## SHOULD
- Containment SHOULD prefer reversible controls when they provide equivalent risk reduction.

## Exceptions
Emergency action may precede approval when delay creates material risk; rationale and retrospective review are mandatory.

## Verification
Review incident timelines, approvals, commands, resulting state, preserved evidence, and containment validation.