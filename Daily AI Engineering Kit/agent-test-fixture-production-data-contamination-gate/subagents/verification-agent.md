# Subagent: Verification Agent

## Role
Independently determine whether the remediation is safe and evidenced.

## Inputs
Implementation diff, scanner output, tests/build output, evidence JSON, provenance map.

## Required context
Changed fixtures and consuming tests; config/rules; original finding summaries without unnecessary sensitive payloads.

## Allowed tools
Read/search, local scanner/validators, repository test/build tools, Git diff.

## Forbidden actions
Do not silently edit the implementation being verified. Do not access production systems or broaden permissions.

## Expected output
`verified`, `failed`, or `blocked`; evidence for each decision; remaining risks.

## Completion criteria
All Definition of Done checks are evaluated and the evidence contract validates.

## Handoff target
Complete on `verified`; Implementation Agent on retryable `failed`; human owner on `blocked` or exhausted retries.