# Perplexity connector workflows

All examples are read/computation operations and require `PERPLEXITY_API_KEY`. No tool requires human approval because this connector does not create, update, publish, delete, send, or administer provider resources.

## Current web search

Tool: `perplexity.search`

```json
{
  "query": "latest .NET security advisory",
  "maxResults": 5,
  "recency": "week",
  "domains": ["msrc.microsoft.com", "github.com"]
}
```

Expected shape: MCP content containing `{ "source": "perplexity", "untrusted": true, "data": ... }` where `data` is the official Perplexity MCP result.

Permission: `READ`. Approval: no.

## Deep research

Tool: `perplexity.research`

```json
{
  "messages": [
    { "role": "user", "content": "Compare current PostgreSQL serverless platforms for production workloads with sources." }
  ]
}
```

Permission: `READ`. Approval: no. This may take longer and consume more API quota than a simple search.

## Filtered Search API

Tool: `perplexity.search.filtered`

```json
{
  "query": "Model Context Protocol security guidance",
  "maxResults": 10,
  "domains": ["modelcontextprotocol.io", "openai.com"],
  "languages": ["en"],
  "searchContextSize": "medium",
  "maxTokens": 8000
}
```

Permission: `READ`. Approval: no.

## Agent API

Tool: `perplexity.agent.run`

```json
{
  "input": "Explain tradeoffs between optimistic and pessimistic concurrency control.",
  "preset": "medium",
  "maxOutputTokens": 3000,
  "maxSteps": 4
}
```

Permission: `READ`. Approval: no.

## Standard embeddings

Tool: `perplexity.embedding.create`

```json
{
  "input": ["ASP.NET Core cancellation", "EF Core optimistic concurrency"],
  "model": "pplx-embed-v1-0.6b",
  "encodingFormat": "base64_int8"
}
```

Permission: `READ`. Approval: no.

## Contextualized embeddings

Tool: `perplexity.embedding.contextualized.create`

```json
{
  "input": [["Section one of a document.", "Section two that depends on section one."]],
  "model": "pplx-embed-context-v1-0.6b"
}
```

Permission: `READ`. Approval: no. Preserve chunk ordering within each document.
