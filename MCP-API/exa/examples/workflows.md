# Exa connector workflows

## Search then fetch

Tool: `exa.web.search`  
Permission: READ; approval: no

```json
{"query":"Model Context Protocol security guidance","numResults":5}
```

Then pass selected result URLs to `exa.web.fetch` (READ; no approval):

```json
{"urls":["https://modelcontextprotocol.io/"]}
```

Expected output is an MCP text result containing JSON with `source: "exa"`, `trust: "untrusted_external_content"`, and upstream `data`.

## Advanced search

Tool: `exa.web.search_advanced`  
Permission: READ; approval: no

```json
{"query":"MCP security","numResults":10,"includeDomains":["modelcontextprotocol.io"],"startPublishedDate":"2026-01-01T00:00:00.000Z"}
```

## Multi-step research

Tool: `exa.research.run`  
Permission: WRITE (may consume paid Exa Agent usage); approval: yes by default

```json
{"prompt":"Compare official MCP security recommendations from primary sources.","approval":"APPROVE_EXA_RESEARCH"}
```

The approval marker is connector-local and is never forwarded upstream.
