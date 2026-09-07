# Automation Safety Rules

## Purpose
Ensure automated chaos systems remain bounded, auditable, and subordinate to explicit human authority for high-risk actions.

## Scope
Applies to scheduled experiments, controllers, agents, orchestration pipelines, auto-expansion, and remediation automation.

## MUST
- Automation MUST enforce approved target scope, duration, fault parameters, concurrency, and abort thresholds.
- High-risk execution MUST distinguish analyze, recommend, prepare, and execute authority.
- Production execution, destructive actions, security weakening, or infrastructure destruction MUST require explicit human approval unless a formally approved control system defines equivalent authority.
- Every automated run MUST produce an auditable record of inputs, actions, decisions, and termination state.

## MUST NOT
- Automation MUST NOT expand privileges or blast radius beyond its authorization.
- An AI agent MUST NOT fabricate approval, suppress safety failures, or continue after a human stop command.
- Force push, history rewriting, secret rotation, destructive infrastructure actions, or irreversible data operations MUST NOT be initiated implicitly as part of chaos cleanup.

## SHOULD
- Controllers SHOULD default to fail-closed behavior when approval, telemetry, or target identity is uncertain.
- Automated remediation SHOULD be independently testable from fault injection.

## Exceptions
Any expanded authority requires documented scope, risk assessment, compensating controls, auditability, and explicit accountable approval.

## Verification
Inspect authorization policies, controller configuration, audit logs, approval records, simulated failure behavior, and kill-switch tests.