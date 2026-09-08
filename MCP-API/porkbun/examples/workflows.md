# Porkbun connector workflows

All provider-returned content is untrusted data. Approval tokens shown below are placeholders produced by a trusted approval service using `PORKBUN_APPROVAL_SECRET`; never ask an LLM to generate or reveal that secret.

## Inspect a domain and DNS

Tool: `porkbun.domain.get`

```json
{ "domain": "example.com" }
```

Permission: READ. Approval: none. Expected output shape is a JSON envelope with `untrusted_provider_data: true`, `provider: "Porkbun"`, `transport: "official-mcp"`, and the official MCP result.

Tool: `porkbun.dns.record.list`

```json
{ "domain": "example.com" }
```

Permission: READ. Approval: none.

## Create a DNS record

Tool: `porkbun.dns.record.create`

```json
{
  "domain": "example.com",
  "name": "app",
  "type": "A",
  "content": "192.0.2.10",
  "ttl": 600,
  "approval_token": "<64-hex payload-bound approval>"
}
```

Permission: WRITE. Approval: required by default. Changing the domain, host, type, content, TTL, or priority invalidates the approval.

## Update authoritative nameservers

Tool: `porkbun.nameserver.update`

```json
{
  "domain": "example.com",
  "nameservers": ["ns1.example.net", "ns2.example.net"],
  "approval_token": "<64-hex payload-bound approval>"
}
```

Permission: HIGH_RISK. Approval: always required because replacing authoritative nameservers can take web, mail, and other DNS-dependent services offline.

## Delete a DNS record

Tool: `porkbun.dns.record.delete`

```json
{
  "domain": "example.com",
  "record_id": "123456789",
  "approval_token": "<64-hex payload-bound approval>"
}
```

Permission: DESTRUCTIVE. Approval: always required, and the process must also start with `PORKBUN_ENABLE_DESTRUCTIVE=true`. The connector never retries this operation blindly.
