# OAuth Audience Boundary Rules

- MCP clients **MUST** request tokens for the canonical MCP resource when the provider supports RFC 8707.
- MCP servers **MUST** reject tokens whose verified audience does not include the configured MCP resource.
- MCP servers **MUST NOT** forward inbound MCP access tokens to upstream APIs.
- A successful OAuth exchange **MUST NOT** be treated as proof of correct audience.
- Provider compatibility fallback **MUST** be explicit, logged, time-bounded, and restricted to configured low-impact operations.
- High-impact tools **MUST NOT** execute without verified audience binding.
- Opaque tokens **MUST** use trusted introspection or an equivalent provider-supported verification path when configured.
- Scope narrowing **SHOULD** supplement audience validation; scopes **MUST NOT** be treated as an audience substitute.
- Authorization metadata/config changes **MUST** trigger revalidation before protected tools are exposed.
- Tests **MUST** include a token valid for another resource and prove it is rejected.
