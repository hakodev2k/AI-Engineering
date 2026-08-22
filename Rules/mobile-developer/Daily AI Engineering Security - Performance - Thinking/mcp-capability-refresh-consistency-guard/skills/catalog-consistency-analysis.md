# Skill: MCP Catalog Consistency Analysis

## Purpose
Detect and diagnose stale MCP capability state before failed calls or full-session restarts accumulate.

## Trigger
Run on `list_changed`, reconnect, TTL expiry, server deployment, authorization change, tool-not-found/schema mismatch, or explicit health check.

## Inputs
Previous catalog JSON, current catalog JSON, server identity, auth-scope fingerprint, connection/session metadata, timestamps.

## Preconditions
Catalog snapshots must be obtained from trusted client/server instrumentation. Secret tokens must not be included; store only authorization-scope fingerprints.

## Required context
Normalized tool names, descriptions, input/output schemas, annotations relevant to routing/policy, and cache metadata.

## Allowed tools
Read-only MCP discovery, JSON normalization, SHA-256, local metrics/logging, `scripts/catalog_fingerprint.py`.

## Constraints
Do not invoke mutating tools during freshness checks. Do not assume transport `connected` means catalog `fresh`. Do not expose credentials in fingerprints or logs.

## Procedure
1. Capture the baseline catalog and compute normalized per-tool and whole-catalog fingerprints.
2. Record the refresh trigger and authoritative server generation when available.
3. Fetch a fresh `tools/list` response, following pagination until complete.
4. Normalize ordering and schema JSON, then fingerprint again.
5. Compare added, removed, and changed tools.
6. Compare client/model-visible catalog if the host exposes it.
7. If authoritative and visible fingerprints differ, invalidate the local capability cache and refresh once.
8. Measure refresh latency and retry once only if the first refresh was a transient transport failure.
9. Emit PASS only when authoritative and visible catalogs agree, or when the host explicitly reports that new catalog generation has been installed.

## Decision points
- Catalog changed but visible index did not: BLOCK stale dispatch.
- Transport failed: one reconnect/reinitialize attempt, then stop.
- Authorization scope changed: force refresh even when server name/version is unchanged.
- Only deterministic ordering changed: treat as no semantic catalog change after normalization.

## Expected output
JSON report with trigger, old/new fingerprints, additions/removals/changes, refresh attempts, latency, and PASS/BLOCK.

## Metrics
Catalog mismatch rate, refresh latency p50/p95, failed calls caused by stale schemas, restart avoidance, cache hit/miss rate.

## Verification
Run the fingerprint script against controlled fixtures where tool order changes, one schema changes, and one tool is added. Confirm only semantic changes alter the fingerprint.

## Failure handling
Maximum two network attempts total. On repeated failure, preserve the last known catalog but mark it `unknown/stale` and block calls that depend on unverified changed capabilities.

## Stop conditions
Stop after two refresh attempts, malformed catalog input, pagination loop, or inability to establish authoritative freshness.