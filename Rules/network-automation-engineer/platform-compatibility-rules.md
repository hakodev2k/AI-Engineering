# Platform Compatibility Rules

## Purpose
Prevent unsupported vendor, operating-system, hardware, or protocol combinations from receiving unsafe automation.

## Scope
Device families, software versions, feature matrices, API capabilities, parsers, and upgrade compatibility.

## MUST
- Automation MUST identify the platform/version/capabilities required by each operation.
- Unsupported or unknown combinations MUST fail closed for mutation unless an explicitly approved compatibility path exists.
- Platform abstractions MUST preserve semantic differences that affect safety or resulting state.
- Dependency or driver upgrades MUST be tested against representative supported platforms before broad rollout.
- Deprecations MUST have an explicit migration plan before support is removed.

## MUST NOT
- MUST NOT assume commands or API schemas are portable because vendor syntax appears similar.
- MUST NOT silently fall back to a different configuration method with weaker transaction or validation guarantees.
- MUST NOT broaden a compatibility declaration without evidence.

## SHOULD
- Capability discovery SHOULD supplement, not replace, an owned support matrix.
- Compatibility tests SHOULD include previous and target software versions used during upgrades.

## Exceptions
Experimental support requires bounded targets, documented limitations, stronger verification, rollback, and owner approval.

## Verification
Review support matrices, capability gates, platform fixtures/lab tests, dependency upgrade results, unknown-platform failure tests, and deprecation tracking.