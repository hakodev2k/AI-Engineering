# Workflow: Release Accessibility Audit

**Trigger:** release candidate, major launch, or scheduled conformance audit.
**Goal:** produce release-ready accessibility evidence and a risk decision package.

1. Freeze audit scope, build/version and supported environments.
2. Run automated checks to discover obvious issues; never use automation as sole evidence.
3. Execute manual critical-journey checks for keyboard, focus, semantics, zoom/reflow, visual states, forms/errors, motion/media and selected assistive technology.
4. Parallelize by review domain while preserving one shared defect ledger.
5. Consolidate duplicates and identify systemic component defects.
6. Classify release blockers and deferred items.
7. Retest fixes against the same environment and steps.
8. Evidence Reviewer verifies reproducibility.
9. Main role publishes audit summary and go/no-go recommendation.

**Human approval required:** acceptance of unresolved high/critical risk or reduced audit scope.
**Bounded retry:** two retest cycles per unresolved item, then escalate.
**Done:** build identity, scope, environments, findings, residual risks, approvals and verification evidence are recorded.