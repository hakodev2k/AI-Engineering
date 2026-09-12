# Harness connector examples

## Inspect delivery state

- Tool: `harness.pipeline.list`
- Input: `{ "page": 0, "size": 20, "search": "checkout" }`
- Permission: `READ`
- Approval: none
- Output: provider JSON returned by Harness, treated as untrusted data.

Then call `harness.pipeline.get` with a returned pipeline identifier and `harness.execution.list` to inspect recent runs.

## Inspect a failed run

- Tool: `harness.execution.get`
- Input: `{ "executionId": "<planExecutionId>" }`
- Permission: `READ`
- Approval: none

## Create a service

- Tool: `harness.service.create`
- Input: `{ "identifier": "payments", "name": "Payments", "description": "Payments service", "tags": { "tier": "1" } }`
- Permission: `WRITE`
- Approval: explicit human approval, represented by `HARNESS_WRITE_APPROVED=true` for the approved execution only.

## Review connectivity

Use `harness.connector.list` and `harness.connector.get` for connector metadata. The connector never asks Harness for underlying secret values and never returns its own API token.
