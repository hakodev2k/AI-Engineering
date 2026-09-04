# Third-Party Model and Vendor Privacy Review

## Purpose
Evaluate external model providers, data processors, labeling vendors, vector platforms, and AI SaaS dependencies for privacy behavior before personal data is disclosed to them.

## When to use
Use during vendor selection, provider migration, new API integration, contract renewal, or material provider feature/configuration changes.

## Inputs
- Proposed data flows and data classes
- Vendor architecture and documentation
- Contractual/privacy terms supplied by responsible stakeholders
- Retention, training-use, residency, and subprocessor information
- Security and incident-response controls

## Context to inspect
Inspect SDK defaults, API endpoints, account settings, provider dashboards, data-retention options, training opt-outs, regional routing, subprocessors, support access, and deletion interfaces.

## Core knowledge
Provider privacy risk depends on actual configuration as well as published policy. Key concerns include data reuse for model improvement, retention, subprocessors, cross-border processing, administrative access, deletion, telemetry, incident notification, and change management.

## Procedure
1. Define exactly what data would be disclosed and why.
2. Minimize payloads before evaluating provider controls.
3. Identify provider role, subprocessors, and processing locations.
4. Verify retention and model-training/data-reuse behavior.
5. Review available zero-retention or enterprise privacy settings.
6. Assess tenant isolation and administrative access.
7. Confirm deletion and export mechanisms.
8. Review incident notification and change-notice processes.
9. Inspect SDK and account defaults against intended configuration.
10. Record contractual gaps for privacy/legal stakeholders.
11. Define technical guardrails that prevent unsupported data classes from being sent.
12. Reassess periodically and after provider changes.

## Decision points
Prefer providers with verifiable configuration and contractual commitments for sensitive workloads. Use gateway-based routing or allowlists when different models have different approved data classes. Consider self-hosting where third-party disclosure is incompatible with risk tolerance.

## Common failure patterns
- Relying only on marketing claims
- Assuming enterprise settings apply to every endpoint
- Ignoring provider telemetry or support access
- Missing subprocessors
- Failing to pin region or account configuration
- Letting developers switch models without privacy review

## Verification
Send controlled test requests, inspect provider dashboards and logs, confirm configured retention/training settings, validate regional routing where supported, and test technical data-class restrictions.

## Expected output
A vendor privacy assessment with approved use cases, prohibited data, configuration requirements, subprocessors, residual risks, and review triggers.

## Stop conditions
Escalate when retention or data reuse is unclear, required contractual commitments are missing, data residency cannot be met, or the provider cannot support required deletion/privacy controls.