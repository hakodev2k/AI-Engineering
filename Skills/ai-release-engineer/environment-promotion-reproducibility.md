# Environment Promotion and Reproducibility

## Purpose
Promote the exact validated AI release through environments without rebuilding or silently substituting models, prompts, indexes, dependencies, or configuration.

## When to use
Use for staging-to-production promotion, regional rollout, regulated environments, and any release where reproducibility matters.

## Inputs
Release manifest, immutable artifacts, environment configuration, secrets references, target regions, compatibility constraints.

## Preconditions
The candidate artifact set has passed required gates in a production-like environment.

## Context to inspect
Environment-specific configuration, model availability, provider regions, network policy, data stores, feature flags, index versions, quotas, and deployment identities.

## Core knowledge
Environment parity does not mean identical secrets or endpoints; it means behavior-affecting differences are explicit, controlled, and tested. Rebuilding per environment introduces supply-chain and reproducibility drift.

## Procedure
1. Freeze the tested release manifest.
2. Identify legitimate environment-specific substitutions.
3. Verify target environment supports required models and dependencies.
4. Promote immutable artifacts rather than rebuilding them.
5. Resolve secrets and endpoints through environment configuration.
6. Validate model aliases to immutable targets where possible.
7. Confirm retrieval/index versions and feature-flag defaults.
8. Run smoke and contract tests after promotion.
9. Compare deployed manifest with the approved candidate.
10. Record any deviations and require re-evaluation when behavior can change.

## Decision points
Permit environment-specific differences only when their risk is understood and validated. Treat model/provider substitution as a behavioral change, not routine configuration.

## Common failure patterns
Rebuilding containers, different prompt versions between staging and production, untracked console config, regional model substitutions, and stale indexes.

## Verification
Compare artifact hashes and resolved configuration across candidate and target; run representative probes against the promoted environment.

## Expected output
A promotion record proving which artifacts moved, which environment-specific values changed, and why the release remains equivalent.

## Stop conditions
Stop when behavior-affecting drift cannot be explained or the target environment cannot reproduce required controls.