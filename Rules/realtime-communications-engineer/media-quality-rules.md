# Media Quality Rules

## Purpose
Maintain perceptual quality under changing network and device conditions.

## Scope
Audio/video quality, adaptation, freezes, jitter, loss, resolution, frame rate, and user experience.

## MUST
- Quality targets MUST be expressed with measurable service and media indicators.
- Quality regressions MUST be evaluated using comparable network/device conditions.
- Audio intelligibility MUST take precedence over discretionary video quality during severe congestion unless product requirements state otherwise.
- Adaptation behavior MUST avoid sustained oscillation between quality states.

## MUST NOT
- MUST NOT use average bitrate as the sole quality metric.
- MUST NOT declare quality improvements from anecdotal calls.
- MUST NOT conceal degraded sessions through aggregate-only reporting.

## SHOULD
- Segment quality metrics by geography, network type, device, codec, and topology.

## Exceptions
Metric substitutions require documented correlation to user experience.

## Verification
Review RTP/RTC stats, objective/perceptual tests, controlled impairment tests, and production quality distributions.