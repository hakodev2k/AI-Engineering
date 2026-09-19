# GrowthBook connector workflows

Provider responses are always returned as untrusted data.

## Inspect flags before a release

1. `growthbook.project.list` — input `{}` — READ — no approval.
2. `growthbook.feature.list` — input `{ "limit": 50, "offset": 0 }` — READ — no approval.
3. `growthbook.feature.get` — input `{ "featureId": "checkout-v2" }` — READ — no approval.

Output shape: `{ "ok": true, "data": <GrowthBook response>, "trust": "untrusted-provider-data" }`.

## Toggle a draft flag

`growthbook.feature.toggle`

```json
{
  "featureId": "checkout-v2",
  "environment": "staging",
  "enabled": true,
  "approval": "<runtime approval secret>"
}
```

Permission: WRITE. Approval: required by default. The approval secret belongs to the connector runtime; do not put it in an LLM prompt or committed configuration.

## Analyze an experiment

1. `growthbook.experiment.list` with `{ "query": "checkout", "status": "running", "limit": 10 }`.
2. `growthbook.experiment.get` with the selected ID.
3. `growthbook.experiment.results` with the selected ID.

All three are READ and require no approval.

## Stop an experiment

`growthbook.experiment.stop` is HIGH_RISK. It is unavailable unless `GROWTHBOOK_ENABLE_HIGH_RISK=true`, and it still requires the approval secret. The optional payload is passed only to GrowthBook's dedicated `/stop` endpoint; arbitrary URLs and methods are not exposed.
