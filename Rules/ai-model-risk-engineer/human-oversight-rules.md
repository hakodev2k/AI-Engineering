# Human Oversight Rules

## Purpose
Define when human judgment, approval, intervention, and escalation are required around model-driven decisions and actions.

## Scope
Applies to high-impact outputs, automated decisions, agentic actions, exception handling, and manual review processes.

## MUST
- High-impact workflows MUST define which decisions require human review before irreversible or consequential action.
- Human reviewers MUST receive sufficient context, limitations, and escalation options to make an independent decision.
- Override and escalation paths MUST be operationally available for material model failures.
- Human oversight controls MUST be tested for realistic workload, latency, and failure conditions.
- Changes that reduce required human review MUST receive documented risk assessment and approval.

## MUST NOT
- Human review MUST NOT be treated as a control when reviewers lack authority, time, information, or practical ability to intervene.
- The system MUST NOT pressure reviewers to accept model recommendations without meaningful independent assessment.

## SHOULD
- Review interfaces SHOULD surface uncertainty, supporting evidence, and known limitations relevant to the decision.
- Teams SHOULD measure override patterns and reviewer disagreement to identify hidden model risk.

## Exceptions
Any reduction in oversight must document rationale, evidence, reversibility, monitoring, residual risk, and authorized approval.

## Verification
Inspect workflow design, permissions, escalation procedures, reviewer guidance, usability evidence, override logs, and control tests.