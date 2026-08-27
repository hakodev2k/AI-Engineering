# Network Semantic Diff and Compliance

## Purpose
Compare intended and actual network state semantically, avoiding false drift caused by syntax ordering or defaults.

## When to use
Use for pre-change review, continuous compliance, drift detection, audits, and remediation.

## Inputs
Intended state, running/operational state, parsing/model adapters, compliance policies, and exception registry.

## Context to inspect
Device defaults, generated sections, ephemeral state, controller ownership, and approved deviations.

## Core knowledge
Text diffs are often insufficient for network configuration. Semantic comparison requires normalization of defaults, ordering, identifiers, and platform representations.

## Procedure
1. Define compliance assertions and scope.
2. Collect current state using structured APIs or parsers.
3. Normalize both intended and observed representations.
4. Exclude explicitly ephemeral/non-authoritative fields.
5. Compute semantic differences.
6. Classify severity and ownership.
7. Check approved time-bounded exceptions.
8. Generate remediation candidate, not immediate mutation by default.
9. Validate remediation through change controls.
10. Track recurring drift causes.

## Decision points
Auto-remediate low-risk deterministic drift; require approval for routing, security, reachability, or broad-impact changes.

## Common failure patterns
Raw text equality, permanent exceptions, controller-vs-automation fights, auto-fixing symptoms without source-of-truth correction, and no severity model.

## Verification
Seed known drift cases, confirm detection precision, test exception expiry, and validate remediation returns state to intent.

## Expected output
Compliance report, semantic diff, severity, exception status, and remediation proposal.

## Stop conditions
Stop automated remediation when authority is ambiguous or observed state indicates an active incident.