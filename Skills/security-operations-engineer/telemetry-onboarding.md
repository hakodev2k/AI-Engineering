# Security Telemetry Onboarding

## Purpose
Onboard logs and security events so they are trustworthy, queryable, cost-controlled and usable for detection and investigation.

## When to use
Use when adding endpoint, identity, network, SaaS, application or cloud telemetry.

## Inputs
Source documentation, sample events, transport path, schema, volume estimates, retention needs, detection requirements and data-classification constraints.

## Context to inspect
Inspect source clocks, identifiers, event loss behavior, rate limits, parsing pipeline, normalization model, encryption, access controls and current downstream consumers.

## Core knowledge
More logs do not automatically improve security. Value depends on fidelity, coverage, timeliness, normalization, retention and query economics.

## Procedure
1. Define security use cases before collection.
2. Identify required event types and fields.
3. Estimate normal and peak volume and cost.
4. Validate source configuration and timestamp semantics.
5. Secure transport and credentials.
6. Parse and normalize without discarding raw evidence prematurely.
7. Map identities, hosts, cloud resources and network entities.
8. Test event completeness and latency.
9. Add source-health monitoring and loss detection.
10. Set retention tiers from investigative value and obligations.
11. Validate target detections and investigation queries.
12. Document ownership and schema-change process.

## Decision points
Collect high-value subsets when full ingestion is cost-prohibitive. Retain raw data when normalization may lose forensic detail. Centralize only when access and residency requirements permit.

## Common failure patterns
Ingesting everything by default; missing audit categories; timezone errors; silent truncation; parsing unknown fields as strings; no health alerting.

## Verification
Prove known source actions appear end-to-end with correct fields, timestamps and entity mappings, and that loss/latency alarms work.

## Expected output
A production telemetry source with documented use cases, schema mapping, health SLOs, retention and ownership.

## Stop conditions
Escalate on unresolved sensitive-data exposure, unacceptable cost, missing legal approval or unfixable source gaps.