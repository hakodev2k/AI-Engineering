# Akeyless MCP workflow examples

All examples use the connector's stable MCP tool interface. Provider responses are treated as untrusted data.

| Tool | Example input | Permission | Approval | Expected output |
|---|---|---|---|---|
| `akeyless.auth.validate` | `{}` | READ | No | `{authenticated:true}` |
| `akeyless.secret.list` | `{"path":"/prod"}` | READ | No | Provider item list/pagination data |
| `akeyless.secret.metadata` | `{"name":"/prod/db"}` | READ | No | Metadata with secret-bearing fields removed |
| `akeyless.secret.read_redacted` | `{"name":"/prod/db"}` | READ | No | Existence/shape only, no value |
| `akeyless.secret.reveal` | `{"name":"/prod/db","approvalToken":"<runtime approval>"}` | HIGH_RISK | Yes | Provider secret response |
| `akeyless.secret.create` | `{"name":"/apps/demo/key","value":"<runtime value>"}` | WRITE | Configurable by host | Provider create result |
| `akeyless.secret.update` | `{"name":"/apps/demo/key","value":"<runtime value>"}` | WRITE | Configurable by host | Provider update result |
| `akeyless.secret.delete` | `{"name":"/apps/demo/key","approvalToken":"<runtime approval>"}` | DESTRUCTIVE | Yes | Provider delete result |

Recommended agent workflow: list → inspect redacted metadata → recommend a change → obtain approval when required → execute. Never place Akeyless access credentials in prompts or tool arguments.
