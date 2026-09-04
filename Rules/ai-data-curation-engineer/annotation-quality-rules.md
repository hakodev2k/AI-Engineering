# Annotation Quality Rules
## Purpose
Control annotation accuracy, consistency, and uncertainty before labels become model evidence.
## Scope
Human labeling, model-assisted labeling, adjudication, and quality-control sampling.
## MUST
- Annotation quality MUST be measured using task-appropriate agreement, accuracy, or adjudication metrics.
- Quality thresholds and escalation criteria MUST be defined before release.
- Material disagreement MUST be investigated for guideline defects, ambiguous data, or annotator calibration issues.
## MUST NOT
- Low agreement MUST NOT be hidden by majority vote without analysis.
- Model-assisted labels MUST NOT be accepted as human-verified unless actual review occurred.
## SHOULD
- High-impact labels SHOULD receive independent review or adjudication.
## Exceptions
Exceptions require documented uncertainty and downstream risk acceptance.
## Verification
Review agreement reports, gold-set performance, adjudication logs, QC samples, and release criteria.