# Third-Party Privacy Review

## Purpose
Evaluate privacy risks introduced when vendors or external services receive, infer, store, or control personal data.

## When to use
Use before onboarding processors, SDKs, analytics tools, AI providers, support platforms, or material vendor changes.

## Inputs
Integration design, data fields, purposes, vendor documentation, locations, subprocessors, retention, deletion, and security capabilities.

## Context to inspect
Inspect actual payloads, default telemetry, onward transfers, administrative access, training/use terms, export/deletion APIs, and failure behavior.

## Core knowledge
Contractual promises do not replace technical minimization. Vendor risk includes hidden collection, secondary use, jurisdiction, lock-in, deletion limitations, and subprocessor chains.

## Procedure
1. Define business need and alternatives.
2. Minimize fields before vendor transfer.
3. Review vendor processing and defaults.
4. Map storage regions and subprocessors.
5. Validate access, retention, deletion, and export controls.
6. Review approved contractual and legal requirements with owners.
7. Configure privacy-preserving settings.
8. Test actual network payloads.
9. Record residual risks and exit plan.
10. Reassess material vendor changes.

## Decision points
Prefer vendors that support scoped processing, regional controls, deletion, and observability when capabilities otherwise meet needs.

## Common failure patterns
Sending full payloads, accepting default telemetry, ignoring subprocessors, and relying solely on questionnaires.

## Verification
Capture representative integration traffic and reconcile it with approved data fields and vendor configuration.

## Expected output
An approved, minimized integration with documented controls and residual risk.

## Stop conditions
Block onboarding when essential processing terms, deletion, or high-risk transfers remain unresolved.