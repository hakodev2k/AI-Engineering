# Firmware Static Analysis

## Purpose
Use compiler diagnostics, static analyzers, semantic queries, and targeted manual review to find firmware defects that can become exploitable or undermine security invariants.

## When to use
Use continuously in CI, before releases, during security reviews, and when investigating bug classes across a codebase.

## Inputs
Source, build database, compiler/toolchain, analyzer configuration, coding standard, suppressions, dependency sources, and prior defect patterns.

## Preconditions
Analyzer must see production-equivalent defines, include paths, generated code, and architecture assumptions. Establish a baseline so new findings are actionable.

## Context to inspect
Memory operations, integer conversions, pointer lifetimes, concurrency/interrupt interactions, unchecked return values, privilege boundaries, cryptographic API use, parser code, and dangerous platform APIs.

## Core knowledge
Static analysis is strongest when multiple complementary techniques are used and findings are tied to threat context. Warning volume without triage creates alert fatigue. Suppressions are security decisions and require rationale and scope.

## Procedure
1. Reproduce the release build and export compilation metadata.
2. Enable strict compiler warnings appropriate to the language/toolchain.
3. Run at least one semantic static analyzer on security-critical code.
4. Configure rules for memory safety, integer overflow, taint, concurrency, and API misuse.
5. Prioritize findings by reachability, attacker control, privilege, and impact.
6. Confirm true positives through code/data-flow inspection.
7. Fix root causes rather than only silencing warnings.
8. Add narrow documented suppressions for proven false positives.
9. Query the codebase for sibling instances of confirmed bug patterns.
10. Gate CI on new high-confidence/high-severity findings.
11. Track analyzer version/configuration changes to avoid silent coverage loss.

## Decision points
Treat warnings-as-errors selectively where toolchain noise is controlled. Deep whole-program analysis is valuable for critical releases but may be too slow for every commit; split fast PR checks from scheduled deep scans.

## Common failure patterns
Analyzing debug configuration only; blanket suppressions; trusting severity labels without reachability analysis; ignoring generated/vendor code that executes privileged; failing to scan alternate feature builds; tool upgrades silently changing rule sets.

## Verification
Confirm release-equivalent analysis completes, new high-priority findings are zero or explicitly accepted, suppressions are reviewed, representative known defects are detected, and fixed bug classes are searched across the repository.

## Expected output
Analyzer configuration, triaged findings, code fixes, justified suppressions, CI gates, and trend/baseline evidence.

## Stop conditions
Escalate when analyzers cannot model critical proprietary code, findings suggest systemic unsafe architecture, or remediation conflicts with certified/safety-controlled source changes.