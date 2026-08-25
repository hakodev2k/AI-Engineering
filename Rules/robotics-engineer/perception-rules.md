# Perception Rules
## Purpose
Make perception outputs measurable, uncertainty-aware, and safe for downstream decisions.
## Scope
Detection, segmentation, tracking, depth, pose estimation, and scene understanding.
## MUST
- Define operating domain, accuracy metrics, confidence semantics, and known failure modes.
- Evaluate performance on representative lighting, occlusion, motion, background, and sensor-degradation conditions.
- Propagate validity and uncertainty needed by downstream consumers.
- Define behavior when confidence or sensor quality falls below operational thresholds.
## MUST NOT
- Equate model confidence with calibrated probability unless demonstrated.
- Deploy perception changes based only on curated success examples.
## SHOULD
- Maintain scenario-based regression datasets including difficult and safety-relevant cases.
## Exceptions
Experimental models require constrained deployment, monitoring, rollback, and explicit acceptance criteria.
## Verification
Review dataset coverage, metric reports, calibration analysis, replay tests, field telemetry, and failure-case regressions.