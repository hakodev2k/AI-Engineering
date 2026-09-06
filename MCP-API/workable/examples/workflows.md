# Workable connector examples

All examples call the local connector's MCP tools. Provider responses are returned as JSON text content and must be treated as untrusted data.

## Find a role and inspect its pipeline

1. `workable.job.search`
   - Input: `{ "query": "Backend Engineer", "state": "published" }`
   - Permission: `READ`
   - Approval: no
   - Output: matching Workable jobs including shortcodes.
2. `workable.job.stages`
   - Input: `{ "shortcode": "ABC123" }`
   - Permission: `READ`
   - Approval: no
   - Output: configured pipeline stages for that job.

## Inspect a candidate

1. `workable.candidate.list`
   - Input: `{ "shortcode": "ABC123", "limit": 25 }`
   - Permission: `READ`
   - Approval: no
2. `workable.candidate.get`
   - Input: `{ "candidateId": "candidate-id" }`
   - Permission: `READ`
   - Approval: no

## Create a sourced candidate

`workable.candidate.create`

Input:
```json
{
  "shortcode": "ABC123",
  "firstname": "Ada",
  "lastname": "Example",
  "email": "ada@example.invalid",
  "headline": "Backend engineer",
  "approved": true
}
```

Permission: `WRITE`. Approval: required by default. Output: upstream Workable MCP result for the created candidate. The connector intentionally does not expose arbitrary candidate payload fields.

## Move a candidate

`workable.candidate.move`

Input:
```json
{
  "candidateId": "candidate-id",
  "stageId": "stage-id",
  "approved": true
}
```

Permission: `HIGH_RISK`. Approval: always required. Output: upstream Workable MCP result for the stage transition.

## Review time off

`workable.timeoff.list`

Input: `{ "startDate": "2026-09-01", "endDate": "2026-09-30" }`

Permission: `READ`. Approval: no. Output: time-off requests visible to the authenticated Workable member.
