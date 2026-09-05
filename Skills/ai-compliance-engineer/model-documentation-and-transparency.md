# Model Documentation and Transparency

## Purpose
Create compliance-grade documentation describing model purpose, provenance, limitations, evaluation evidence, operational constraints, and accountable ownership.

## When to use
Use when approving a model, documenting a fine-tune, onboarding a third-party model, supporting customer disclosures, or preparing audit evidence.

## Inputs
Model source, version, intended use, training/fine-tuning summary, evaluation results, known limitations, deployment configuration, risk assessment.

## Preconditions
Technical owners can provide reproducible model and evaluation metadata.

## Context to inspect
Model cards, provider documentation, training records, evaluation reports, deployment manifests, prompt/config versions, safety controls.

## Core knowledge
Transparency should be audience-specific. Internal compliance records require more detail than user-facing notices. Documentation must distinguish known facts, measured results, assumptions, and provider claims.

## Procedure
1. Identify model owner, source, version, and licensing terms.
2. Define intended and prohibited uses.
3. Describe material training or adaptation information available.
4. Record evaluation datasets, metrics, and limitations.
5. Document safety, security, and privacy controls.
6. Record deployment constraints and dependencies.
7. Identify known failure modes and affected groups.
8. Link to risk assessments and approval decisions.
9. Define user-facing transparency needs.
10. Version documentation with model changes.

## Decision points
Expose enough information for accountability without disclosing secrets or creating new security risk. Label vendor claims that were not independently verified.

## Common failure patterns
Copying marketing documentation, omitting model version, mixing intended use with actual use, publishing unsupported performance claims, and letting documentation drift from production.

## Verification
Compare documentation against deployed configuration and evaluation artifacts; confirm every material claim has evidence or is explicitly labeled as an assumption/vendor statement.

## Expected output
A versioned model documentation package suitable for internal governance, audits, and derived transparency notices.

## Stop conditions
Escalate when provenance, licensing, material limitations, or evaluation evidence is unavailable for a high-risk deployment.