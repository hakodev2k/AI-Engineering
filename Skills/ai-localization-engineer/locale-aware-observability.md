# Locale-Aware Observability

## Purpose
Make multilingual quality and reliability diagnosable in production by preserving locale context in logs, metrics, traces, and feedback signals.

## When to use
Use when production issues vary by language or market, or when aggregate monitoring hides locale-specific failures.

## Inputs
Telemetry architecture, locale-resolution rules, quality metrics, privacy policy, feedback channels, incident taxonomy, and SLOs.

## Preconditions
Locale metadata can be propagated without exposing prohibited personal data.

## Context to inspect
Inspect request context, logs, traces, dashboards, model telemetry, translation services, moderation events, retrieval metrics, user feedback, and alerting.

## Core knowledge
Locale is an important diagnostic dimension but can create high-cardinality telemetry. Store normalized locale codes and carefully chosen quality indicators rather than raw sensitive content. Observability should connect locale to model, prompt, retrieval, translation, and release versions.

## Procedure
1. Define normalized locale dimensions for telemetry.
2. Propagate locale through relevant request and model spans.
3. Add metrics for latency, errors, fallback use, quality, safety, and translation failures by locale.
4. Tag model, prompt, retrieval-index, and translation-engine versions.
5. Build dashboards that expose both traffic-weighted and per-locale health.
6. Define alerts for severe locale regressions.
7. Link feedback and incidents to reproducible configurations.
8. Review cardinality, retention, and privacy impact.

## Decision points
Use coarse language grouping for low-risk aggregate monitoring; use full locale segmentation when regional behavior matters. Sample raw examples only under approved privacy controls.

## Common failure patterns
English-only dashboards, unbounded locale tags, logging raw conversations, missing version metadata, and averaging away failures in small markets.

## Verification
Trigger known locale failures in a safe environment and confirm traces, metrics, dashboards, and alerts expose the affected path without leaking restricted content.

## Expected output
A locale-aware observability design with dashboards, alerts, metadata contracts, and privacy controls.

## Stop conditions
Stop when required telemetry would violate privacy policy or locale cannot be propagated reliably through the system.