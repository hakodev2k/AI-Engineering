# Edge Security Rules

## Purpose
Apply security controls at the CDN edge without creating bypasses or false assurance.

## Scope
Applies to WAF integration, bot controls, request filtering, security headers, access restrictions, and edge enforcement.

## MUST
- Edge security controls MUST have an identified threat or policy requirement.
- Bypass paths MUST receive equivalent controls or be explicitly risk-accepted.
- Security rules MUST distinguish blocking, challenging, logging, and rate-limiting actions.
- New blocking rules MUST be evaluated for false-positive impact before broad rollout.
- Security-relevant configuration changes MUST be auditable.

## MUST NOT
- MUST NOT weaken security controls solely to resolve an application defect.
- MUST NOT trust client-supplied identity or forwarding headers unless sanitized by a trusted boundary.
- MUST NOT claim an edge control protects traffic that can bypass the edge.

## SHOULD
- Stage high-impact rules in observe mode when risk permits.
- Correlate edge detections with origin and application telemetry.
- Prefer narrowly scoped controls over broad patterns.

## Exceptions
Control reductions require reason, evidence, duration, compensating controls, risk owner, and security approval.

## Verification
Inspect effective edge policy and bypass routes; execute authorized negative tests; review false positives, blocked requests, origin reachability, and audit records.