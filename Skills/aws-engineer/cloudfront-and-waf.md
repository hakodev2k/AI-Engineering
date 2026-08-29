# CloudFront and WAF

## Purpose
Design secure and performant global edge delivery using CloudFront and AWS WAF.

## When to use
Use for websites/APIs needing caching, origin protection, global latency reduction, bot/rate controls, or DDoS-resistant edge patterns.

## Inputs
Origins, cacheability, request variation, auth model, geographies, threat model, rate expectations, TLS requirements.

## Context to inspect
Distributions, cache/origin request policies, signed URLs/cookies, origin access control, WAF rules, logs, Shield, invalidation usage.

## Core knowledge
Cache keys define correctness and hit ratio. Forwarding unnecessary headers/cookies fragments cache. WAF is a filtering layer, not a replacement for application authorization or validation.

## Procedure
1. Classify cacheable and dynamic paths.
2. Minimize cache-key dimensions while preserving response correctness.
3. Protect origins with OAC/private networking patterns where supported.
4. Configure TLS and security headers.
5. Apply WAF managed rules, rate limits, and targeted custom rules.
6. Start risky rules in count mode and inspect false positives.
7. Define invalidation/versioned-asset strategy.
8. Enable logs and edge metrics.
9. Test cache behavior, origin failure, rule bypass attempts, and signed-access flows.

## Decision points
Prefer versioned object names over frequent invalidations. Use custom WAF rules only when measurable risk justifies maintenance burden.

## Common failure patterns
Caching personalized content incorrectly, forwarding every header, exposing S3 origins publicly, blocking legitimate traffic with untested WAF rules, and assuming edge cache fixes slow origins.

## Verification
Inspect cache-hit ratios, cache-key variants, origin traffic, WAF sampled requests, and security tests.

## Expected output
Distribution policy, WAF rules, origin-protection design, and validation evidence.

## Stop conditions
Escalate when cache changes could expose user-specific data or security rules may block critical traffic without a safe rollout.