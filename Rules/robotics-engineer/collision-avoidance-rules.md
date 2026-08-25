# Collision Avoidance Rules
## Purpose
Prevent contact events beyond accepted operational risk.
## Scope
Self-collision, environment collision, dynamic obstacles, protective separation, and stopping margins.
## MUST
- Model relevant robot geometry, payload, swept volume, braking distance, latency, and uncertainty.
- Validate collision checking and stopping behavior at representative speeds and payloads.
- Define conservative behavior for unknown or poorly observed space when collision consequences are material.
- Recompute safety margins when speed, payload, sensing, braking, or environment assumptions change.
## MUST NOT
- Use visualization alone as proof of collision safety.
- Disable collision checks to resolve planner failures in production.
## SHOULD
- Include dynamic-obstacle prediction only when its failure behavior is bounded.
## Exceptions
Reduced margins require quantified evidence and explicit safety approval.
## Verification
Use geometric regression tests, measured stop tests, obstacle scenarios, sensor-degradation tests, and configuration review.