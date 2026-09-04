# Negative Controls and Placebos

## Purpose
Use outcomes, exposures, periods, or populations that should not respond causally to the treatment to detect residual confounding, leakage, specification errors, and spurious design artifacts.

## When to use
Use in observational and quasi-experimental analyses as falsification evidence, especially when identification depends on strong untestable assumptions.

## Inputs
- Main causal design
- Candidate negative-control outcomes/exposures
- Pre-treatment periods or placebo cutoffs
- Domain knowledge about impossible causal pathways

## Context to inspect
Inspect timing, shared measurement pipelines, latent common causes, exposure definitions, and whether the proposed control truly cannot be causally affected.

## Core knowledge
Negative controls do not prove identification when null. A non-null control can reveal confounding, selection, contamination, anticipation, or model failure. Placebo tests must be specified so they target a concrete threat.

## Procedure
1. List the design's most important failure modes.
2. For each threat, choose a negative control or placebo that should expose it.
3. Justify why the control has no plausible causal pathway from treatment.
4. Reuse the main analysis pipeline without favorable retuning.
5. Estimate placebo effects with the same uncertainty conventions.
6. Test pre-treatment outcomes or false intervention dates when time structure permits.
7. Test unaffected outcomes or exposures when domain knowledge supports them.
8. Compare magnitudes, not only p-values, with the primary effect.
9. Investigate any systematic non-null placebo result.
10. Update the causal claim or design when falsification evidence contradicts assumptions.

## Decision points
Choose controls that share confounding/measurement mechanisms with the main analysis but lack the causal pathway of interest. Avoid arbitrary unrelated outcomes that cannot diagnose the actual design.

## Common failure patterns
- Cherry-picking null placebos
- Treating nonsignificance as proof
- Retuning models until controls are null
- Using controls that treatment can actually affect
- Ignoring economically meaningful placebo magnitudes

## Verification
Verify the control's causal rationale, identical analysis treatment, uncertainty, and consistency across multiple threat-specific checks.

## Expected output
A falsification report linking each negative control/placebo to a causal threat and explaining how results change confidence in the design.

## Stop conditions
Stop or materially weaken causal conclusions when well-designed negative controls repeatedly produce effects comparable to the primary estimate.