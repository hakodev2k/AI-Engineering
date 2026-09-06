# Model Extraction and Scraping Detection

## Purpose
Detect systematic attempts to replicate model behavior, harvest outputs at scale, or abuse inference capacity beyond intended product use.

## When to use
Use for public or partner-facing model APIs, high-value proprietary models, and products exposed to automated querying.

## Inputs
Request volume, token counts, prompt diversity, output reuse patterns, API keys, identity metadata, rate-limit events, billing data, model routes, and historical baselines.

## Preconditions
Requests can be correlated by account, credential, tenant, or another stable identifier.

## Context to inspect
Review API quotas, authentication, model pricing, batching, streaming, cache behavior, geographic patterns, credential issuance, and contractual usage limits.

## Core knowledge
Extraction commonly appears as sustained high-coverage sampling rather than one obviously malicious request. Signals may include unusual prompt diversity, systematic class probing, repeated boundary queries, high output-token ratios, distributed credentials, or synchronized access.

## Procedure
1. Define extraction and scraping abuse outcomes.
2. Establish normal request-volume and diversity baselines by customer segment.
3. Create account-, credential-, network-, and campaign-level aggregations.
4. Detect sustained anomalous sampling and coordinated credential use.
5. Correlate volume with product entitlement and billing behavior.
6. Separate legitimate evaluation, load testing, and enterprise automation from suspicious harvesting.
7. Apply progressive response: observe, throttle, challenge, suspend, or investigate.
8. Preserve evidence for high-confidence campaigns.
9. Retest detections against distributed and low-and-slow patterns.

## Decision points
Use rate controls when abuse is primarily resource consumption; escalate to investigation when behavior suggests intellectual-property theft or coordinated credential misuse.

## Common failure patterns
Simple per-IP thresholds, ignoring distributed identities, flagging approved benchmark workloads, and enforcing blocks without preserving investigation evidence.

## Verification
Implemented means campaign-level detection runs. Verified means simulated extraction patterns are detected across single and distributed identities while approved heavy workloads remain within policy.

## Expected output
Detection logic, baseline metrics, escalation thresholds, response controls, and validation evidence.

## Stop conditions
Escalate when suspected extraction involves stolen credentials, contractual disputes, or evidence requiring legal or executive handling.