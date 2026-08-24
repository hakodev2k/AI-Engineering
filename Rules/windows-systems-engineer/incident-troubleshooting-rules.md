# Incident Troubleshooting

## Purpose
Drive evidence-based diagnosis while minimizing additional production harm.

## Scope
Windows incidents involving hosts, identity, policy, storage, network, services, updates, and dependencies.

## MUST
- Investigation MUST establish timeline, affected scope, symptoms, recent changes, and available evidence before broad remediation.
- Hypotheses MUST be tested with observations that can distinguish likely causes.
- Diagnostic actions with production risk MUST be bounded and reversible where possible.
- Incident changes MUST be recorded with actor, time, target, result, and rationale.
- Destructive remediation MUST require human approval unless an explicitly pre-authorized runbook permits it.

## MUST NOT
- MUST NOT reboot, disable security controls, purge data, or reset configuration as a default diagnostic step.
- MUST NOT declare root cause from temporal correlation alone.
- MUST NOT destroy logs or volatile evidence unnecessarily.

## SHOULD
- Preserve evidence before remediation and compare healthy versus affected systems.
- Bound root cause honestly when definitive proof is unavailable.

## Exceptions
Emergency deviations require incident context, risk, authorization, and retrospective review.

## Verification
Review timeline, commands/actions, logs, metrics, events, reproduction evidence, change correlation, and proof that remediation addressed the bounded cause.