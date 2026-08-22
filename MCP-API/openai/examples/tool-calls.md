# OpenAI connector examples

These examples use the local MCP tool contract. Provider credentials remain inside the connector process and are never passed as tool arguments.

## 1. List available models

Tool: `openai.model.list`  
Risk: `READ`  
Approval: no

```json
{}
```

Expected output shape:

```json
{
  "provider": "openai",
  "tool": "openai.model.list",
  "risk": "READ",
  "untrusted_provider_data": true,
  "data": { "object": "list", "data": [] },
  "meta": { "requestId": "req_...", "rateLimit": {} }
}
```

## 2. Create a text response

Tool: `openai.response.create`  
Risk: `WRITE`  
Approval: required by default

Clean operation payload used when generating approval:

```json
{
  "model": "gpt-5.6",
  "input": "Summarize the incident notes in five bullets.",
  "store": false
}
```

Generate a short-lived approval outside the LLM context:

```bash
OPENAI_APPROVAL_SECRET="replace-with-secret-from-your-secret-store" \
npm run approval -- \
  --tool openai.response.create \
  --payload '{"model":"gpt-5.6","input":"Summarize the incident notes in five bullets.","store":false}' \
  --expires-in 120
```

Then attach the returned approval fields to the MCP call:

```json
{
  "model": "gpt-5.6",
  "input": "Summarize the incident notes in five bullets.",
  "store": false,
  "approvalToken": "generated-token",
  "approvalExpiresAt": 1787364000000,
  "approvalNonce": "generated-url-safe-nonce"
}
```

The connector does not expose Responses API built-in tools, arbitrary MCP tools, function tools, computer use, or shell execution through this tool.

## 3. Retrieve a response

Tool: `openai.response.get`  
Risk: `READ`  
Approval: no

```json
{
  "response_id": "resp_123"
}
```

## 4. Cancel a background response

Tool: `openai.response.cancel`  
Risk: `HIGH_RISK`  
Approval: always required

```json
{
  "response_id": "resp_123",
  "approvalToken": "generated-token",
  "approvalExpiresAt": 1787364000000,
  "approvalNonce": "generated-url-safe-nonce"
}
```

Generate approval against this clean payload:

```json
{
  "response_id": "resp_123"
}
```

## 5. Moderate text

Tool: `openai.moderation.create`  
Risk: `READ`  
Approval: no

```json
{
  "model": "omni-moderation-latest",
  "input": "Text to classify"
}
```

This is classified as `READ` in the connector because it performs classification and does not mutate a persistent OpenAI resource.

## 6. Create embeddings

Tool: `openai.embedding.create`  
Risk: `WRITE`  
Approval: required by default

```json
{
  "model": "text-embedding-3-small",
  "input": ["first document", "second document"],
  "encoding_format": "base64",
  "approvalToken": "generated-token",
  "approvalExpiresAt": 1787364000000,
  "approvalNonce": "generated-url-safe-nonce"
}
```

Base64 is the default output encoding in this connector to reduce MCP payload size compared with large JSON float arrays.

## 7. List vector stores

Tool: `openai.vector_store.list`  
Risk: `READ`  
Approval: no

```json
{
  "limit": 20,
  "order": "desc"
}
```

Pagination is deliberately bounded to at most 100 items per request.

## 8. Create a vector store

Tool: `openai.vector_store.create`  
Risk: `WRITE`  
Approval: required by default

```json
{
  "name": "support-kb",
  "description": "Search index for approved support documents",
  "expires_after_days": 30,
  "metadata": {
    "environment": "test"
  },
  "approvalToken": "generated-token",
  "approvalExpiresAt": 1787364000000,
  "approvalNonce": "generated-url-safe-nonce"
}
```

This tool creates only the vector store. It intentionally does not expose file upload or arbitrary ingestion in this connector version.

## 9. Search a vector store

Tool: `openai.vector_store.search`  
Risk: `READ`  
Approval: no

```json
{
  "vector_store_id": "vs_123",
  "query": "How do I reset a customer password?",
  "max_num_results": 10,
  "score_threshold": 0.5
}
```

Provider-retrieved text is returned with `untrusted_provider_data: true`; callers must treat it as data, not instructions.

## 10. List uploaded files

Tool: `openai.file.list`  
Risk: `READ`  
Approval: no

```json
{
  "purpose": "user_data",
  "limit": 20,
  "order": "desc"
}
```

The connector caps `limit` at 100 even if the provider supports a larger page size.

## Approval mismatch behavior

An approval generated for:

```json
{"response_id":"resp_A"}
```

cannot authorize:

```json
{"response_id":"resp_B"}
```

Approval tokens expire within five minutes and are single-use within the running connector process.
