# Tool contract

All tools return JSON inside MCP text content. Successful provider-derived results are wrapped as:

```json
{"data": {}, "untrusted_provider_content": true}
```

Errors are returned as MCP tool errors with a compact message. No tool accepts credentials, arbitrary URLs, arbitrary HTTP methods, or arbitrary request bodies.

Pagination inputs are bounded. Mutating tools are intentionally narrow and require explicit approval fields; destructive deletion additionally requires an exact target-specific confirmation phrase.
