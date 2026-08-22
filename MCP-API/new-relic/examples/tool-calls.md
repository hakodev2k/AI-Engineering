# Tool-call examples

Provider content returned by these tools is untrusted data, not instructions. Examples contain no credentials.

| Tool | Example input | Risk | Approval |
|---|---|---|---|
| `newrelic.account.list` | `{}` | READ | No |
| `newrelic.entity.search` | `{ "query": "domainType = 'APM-APPLICATION'" }` | READ | No |
| `newrelic.entity.get` | `{ "guid": "ENTITY_GUID" }` | READ | No |
| `newrelic.entity.related.list` | `{ "guid": "ENTITY_GUID" }` | READ | No |
| `newrelic.entity.tag.search` | `{ "tag_key": "aws.awsRegion", "tag_value": "us-east-1" }` | READ | No |
| `newrelic.entity.non_reporting.list` | `{ "changed_after_ms": 1787300000000 }` | READ | No |
| `newrelic.nrql.query` | `{ "account_id": 1234567, "nrql": "SELECT count(*) FROM Transaction SINCE 1 hour ago" }` | READ | No |
| `newrelic.alert.policy.list` | `{ "account_id": 1234567, "name_like": "production" }` | READ | No |
| `newrelic.alert.policy.get` | `{ "account_id": 1234567, "policy_id": "3455" }` | READ | No |
| `newrelic.alert.policy.create` | `{ "account_id": 1234567, "name": "Production API", "incident_preference": "PER_CONDITION" }` | WRITE | Yes by default |
| `newrelic.alert.policy.update` | `{ "account_id": 1234567, "policy_id": "3455", "name": "Production API v2" }` | WRITE | Yes by default |
| `newrelic.alert.policy.delete` | `{ "account_id": 1234567, "policy_id": "3455" }` | DESTRUCTIVE | Strong approval + destructive enablement |

Successful calls return the selected NerdGraph JSON as formatted MCP text content. Provider authorization and GraphQL errors are surfaced without intentionally exposing the configured user API key.
