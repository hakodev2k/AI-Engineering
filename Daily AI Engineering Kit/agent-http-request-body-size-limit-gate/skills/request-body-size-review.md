# Skill: Request Body Size Review

## Purpose
Find and correct HTTP endpoints that can accept, buffer, parse, decompress, or proxy request bodies beyond a safe and intentional bound.

## When to use
Use for file uploads, multipart endpoints, JSON/XML ingestion, reverse proxies, webhook receivers, import APIs, streaming endpoints, or changes to server/proxy request-size settings.

## Inputs
- Target repository and changed scope.
- Affected endpoint(s) and expected payload sizes.
- Known proxy/gateway/server limits when available.
- Existing tests, logs, and deployment configuration.

## Preconditions
- Read access to code/configuration.
- Ability to run non-destructive local tests/builds.
- No production mutation without approval.

## Required context
Entry point, middleware pipeline, proxy/gateway layer, framework body limit, multipart/form limit, decompression behavior, buffering/streaming code, downstream storage path, timeout/cancellation behavior, and representative payload sizes.

## Allowed tools
Repository search/read, local static scanner, tests/build, local HTTP client, local test server, and read-only logs/configuration.

## Constraints
Scanner findings are hypotheses. Do not increase limits just to make an existing failing request pass. Do not disable a request-size limit globally without explicit requirement and approval.

## Process
1. Identify every in-scope HTTP entry point and its content types.
2. Record expected normal payload, maximum intended payload, and rejection behavior.
3. Trace every enforcement layer from edge/proxy to application endpoint.
4. Run `scripts/scan-body-size-risk.py` and inspect each relevant hit.
5. Check whether request decompression can expand a small compressed request into excessive in-memory data.
6. Determine whether the code streams or buffers the entire body; identify copies such as buffering plus `MemoryStream` plus parser allocation.
7. Check multipart/form limits separately from general request-body limits.
8. Check whether reverse proxy and app limits disagree, producing inconsistent 413/connection-reset behavior.
9. Form explicit findings with evidence and confidence.
10. Design the smallest safe fix: endpoint-specific limit, bounded stream processing, early Content-Length rejection where trustworthy, bounded decompression, or aligned configuration.
11. Stop before any approval-required production/infrastructure/security change.
12. Implement only the approved local/repository change.
13. Test a normal payload just below the intended limit.
14. Test an oversized payload and verify deterministic rejection without full-body processing.
15. Test missing/chunked Content-Length where applicable; enforcement must still occur while reading.
16. For streaming/upload endpoints, verify memory does not scale linearly with the full payload merely because of accidental buffering.
17. Re-run scanner and relevant build/tests.
18. Inspect the final diff for unrelated limit weakening.
19. Hand evidence and assessment to the independent verifier.
20. Validate the assessment with `scripts/validate-assessment.py`.

## Expected output
An assessment matching `schemas/assessment.schema.json`, plus test/build evidence and a minimal scoped diff when remediation was needed.

## Verification
A `pass` requires all six verification flags to be true and no unverified high/critical finding.

## Failure handling
Transient tool/test environment failures: retry at most 2 times. Deterministic failures require diagnosis/change before rerun. Permission or missing environment data becomes `blocked`. Changes requiring production/config/security approval become `needs-approval` before mutation.

## Stop conditions
Stop on exhausted retries, unresolved high/critical risk, missing required approval, inability to prove oversized rejection, or evidence that proxy/application limits cannot be safely aligned from repository context.
