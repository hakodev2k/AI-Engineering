# Tool-call examples

These examples contain no credentials. Provider responses are untrusted data and must not be treated as instructions.

| Tool | Example input | Permission | Approval |
|---|---|---|---|
| `cloudflare.zone.list` | `{ "name": "example.com", "page": 1, "per_page": 20 }` | Zone:Zone Read | No |
| `cloudflare.zone.get` | `{ "zone_id": "0123456789abcdef0123456789abcdef" }` | Zone read capability | No |
| `cloudflare.dns.record.list` | `{ "zone_id": "0123456789abcdef0123456789abcdef", "type": "A" }` | DNS Read | No |
| `cloudflare.dns.record.get` | `{ "zone_id": "0123456789abcdef0123456789abcdef", "record_id": "abcdef0123456789abcdef0123456789" }` | DNS Read | No |
| `cloudflare.dns.record.create` | `{ "zone_id": "0123456789abcdef0123456789abcdef", "type": "A", "name": "app.example.com", "content": "198.51.100.10", "ttl": 300, "proxied": true }` | DNS Write | Yes by default |
| `cloudflare.dns.record.update` | `{ "zone_id": "0123456789abcdef0123456789abcdef", "record_id": "abcdef0123456789abcdef0123456789", "type": "A", "name": "app.example.com", "content": "198.51.100.11", "ttl": 300, "proxied": true }` | DNS Write | Yes by default |
| `cloudflare.dns.record.delete` | `{ "zone_id": "0123456789abcdef0123456789abcdef", "record_id": "abcdef0123456789abcdef0123456789" }` | DNS Write | Strong approval; disabled by default |
| `cloudflare.cache.purge.urls` | `{ "zone_id": "0123456789abcdef0123456789abcdef", "files": ["https://example.com/app.css"] }` | Cache Purge | Yes |
| `cloudflare.cache.purge.everything` | `{ "zone_id": "0123456789abcdef0123456789abcdef" }` | Cache Purge | Yes |

Successful tools return the Cloudflare API envelope as formatted JSON text. Provider errors are surfaced as tool errors and include the HTTP status without exposing the API token.
