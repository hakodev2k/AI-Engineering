# Troubleshooting Rules
## Purpose
Make troubleshooting evidence-driven, safe, and efficient.
## Scope
Errors, diagnostics, known issues, support playbooks, and recovery guidance.
## MUST
- Start from observable symptoms and define evidence needed to distinguish likely causes.
- Order diagnostic steps from low-risk/high-information to higher-risk actions.
- Preserve diagnostic information before resets, cleanup, or state-changing remediation when it may be needed for root-cause analysis.
- Define success verification and escalation criteria.
## MUST NOT
- Present speculative root causes as confirmed facts.
- Recommend destructive cleanup or security bypasses as first-line troubleshooting.
## SHOULD
- Include exact log locations, metrics, error patterns, commands, or artifacts when stable and safe.
## Exceptions
Emergency recovery may prioritize restoration over diagnosis when the incident process records evidence loss and follow-up obligations.
## Verification
Reproduce representative failures, validate diagnostic branches, test remediation, and review escalation boundaries.