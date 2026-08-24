# Robustness and Distribution Shift Rules

## Purpose
Ensure safety claims remain bounded when real usage differs from evaluation conditions.

## Scope
Covers domain shift, language, user populations, prompt styles, tool states, model updates, and environmental changes.

## MUST
- State the operating conditions under which safety evidence is valid.
- Test material variations expected in production, including edge and degraded conditions.
- Monitor for shifts that invalidate evaluation assumptions.
- Trigger reassessment when observed usage materially departs from validated conditions.

## MUST NOT
- Generalize narrow benchmark success to unsupported populations or contexts.
- Ignore severe subgroup failures hidden by aggregate performance.
- Treat robustness as established from synthetic perturbations alone when real shifts are plausible.

## SHOULD
- Use stratified metrics and stress tests targeted at known weak regions.
- Design mitigations that fail safely outside validated envelopes.

## Exceptions
Untested operating regions require explicit limitation, compensating controls, monitoring, and risk acceptance.

## Verification
Inspect coverage matrices, subgroup results, production drift metrics, reassessment triggers, and documented validity bounds.
