# Model Documentation Standard

## Purpose
Create evidence-quality documentation for models and AI components so reviewers understand intended use, provenance, limitations, evaluations, and operational constraints.

## When to use
Use for internally built models, adapted models, major model upgrades, or governance onboarding of externally sourced models.

## Inputs
Training/adaptation records, datasets, architecture, evaluations, intended uses, limitations, safety tests, deployment constraints, ownership.

## Procedure
1. Identify model/version and accountable owner.
2. Document origin, license, adaptation, and dependency provenance.
3. Define intended and out-of-scope uses.
4. Record relevant data characteristics and known limitations.
5. Summarize evaluation methods, datasets, metrics, thresholds, and uncertainty.
6. Document safety/security findings and mitigations.
7. Define operational requirements and monitoring.
8. Record change history and approval state.
9. Link immutable supporting evidence.
10. Review documentation whenever model behavior or use changes materially.

## Decision points
Expose detail proportional to audience and risk while protecting legitimate secrets; withholding sensitive detail must not prevent independent assurance.

## Common failure patterns
Marketing language, cherry-picked metrics, missing version IDs, undocumented adaptation, stale limitations, claims without evidence.

## Verification
A reviewer can reproduce the governance decision trail and identify the exact model artifact and evidence used.

## Expected output
Versioned model documentation suitable for engineering, governance, audit, and risk review.

## Stop conditions
Escalate missing provenance, licensing uncertainty, or unavailable evaluation evidence.