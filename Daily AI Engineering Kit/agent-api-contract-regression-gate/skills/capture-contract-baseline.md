# Skill: Capture Contract Baseline

## Purpose
Create a reproducible OpenAPI baseline artifact before an agent evaluates or changes an API.

## When to use
Use before feature implementation, refactoring, dependency upgrades, framework upgrades, or release preparation when public HTTP contracts may change.

## Inputs
- Baseline source: local OpenAPI file or HTTP(S) URL.
- Destination path, normally `artifacts/openapi-baseline.json`.
- Optional authorization supplied externally to the capture command; never persist secrets.

## Preconditions
- The baseline represents an accepted release or explicitly approved contract.
- `python3` is available.
- `curl` is available when the source is an HTTP(S) URL.
- `PyYAML` is installed only when YAML input must be parsed.

## Allowed tools
Repository read tools, build tools that generate OpenAPI, HTTP retrieval for approved endpoints, and `scripts/capture-openapi.sh`.

## Constraints
- Do not mutate the source artifact.
- Do not replace an accepted baseline merely because the candidate differs.
- Do not save authorization headers or cookies.

## Procedure
1. Identify the accepted baseline release, tag, artifact, or service endpoint.
2. Confirm that the source is stable enough to reproduce.
3. Run `scripts/capture-openapi.sh <source> artifacts/openapi-baseline.json`.
4. Inspect the script exit code. Stop on non-zero.
5. Record the source used and commit/release identifier outside the contract artifact when available.
6. Confirm the output parses as an OpenAPI JSON object and contains `paths`.
7. Preserve the resulting file unchanged for the comparison stage.

## Expected output
A normalized JSON OpenAPI document at the configured baseline path.

## Verification
- Output file exists and is non-empty.
- JSON parsing succeeds.
- Root value is an object.
- `paths` exists and is an object.

## Failure handling
- Network or transient HTTP failure: retry at most 2 times.
- Authentication/permission failure: stop; request authorized access rather than broadening permissions.
- Parse failure: stop and preserve the raw source location and error.
- Missing `paths`: stop and classify as invalid contract input.

## Stop conditions
Stop after a verified baseline is captured or after the bounded retry policy is exhausted.
