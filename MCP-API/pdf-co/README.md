# PDF.co MCP/API Connector

Reusable safety wrapper around the **official PDF.co MCP server** (`pdfdotco/pdfco-mcp`). It exposes a deliberately small, stable, provider-scoped tool surface for common agent document workflows while isolating credentials and enforcing approval boundaries.

## Upstream strategy

PDF.co publishes an official local stdio MCP server installable with `uvx pdfco-mcp`. The official server covers PDF conversion, merge/split, form operations, search, invoice parsing, OCR/searchability, security and file/job operations. Because every capability selected here is available in that trusted MCP implementation, this connector routes all implemented tools through MCP rather than duplicating them with REST calls. PDF.co also provides the REST API at `https://api.pdf.co`; it is documented as the underlying platform and remains a future fallback option, but this package intentionally does not expose arbitrary REST requests.

Official sources researched for this connector:
- PDF.co MCP announcement: `https://pdf.co/resources/blog/introducing-pdf-co-mcp-server-easy-integration-with-ai-powered-tools`
- Official MCP implementation: `https://github.com/pdfdotco/pdfco-mcp`
- API documentation: `https://developer.pdf.co`
- API product overview: `https://pdf.co/products`
- Rate-limit guidance: `https://support.pdf.co/en/articles/11141293-i-m-getting-a-rate-limit-error-429-too-many-requests`
- Credit/endpoint guidance: `https://support.pdf.co/en/articles/11141295-how-many-credits-do-i-need`

## Architecture

`MCP client -> this stdio MCP server -> allowlisted official PDF.co stdio MCP -> PDF.co API`

The API key exists only in the connector process and is passed to the official upstream process as `X_API_KEY`. It is never accepted as a tool argument and never returned to the model. On startup the connector discovers the upstream tool list and fails closed if any required allowlisted tool is missing. Upstream responses are explicitly wrapped as untrusted provider data.

## Requirements and installation

- Node.js 20+
- Python `uv`/`uvx` available on PATH (required by the official PDF.co MCP package)
- PDF.co API key

```bash
npm install
npm run build
PDFCO_API_KEY=... npm start
```

Set `PDFCO_UVX_COMMAND` only when `uvx` is installed under a nonstandard executable name/path. Configure an MCP client to launch `node /absolute/path/to/dist/server.js` over stdio.

## Authentication and environment

PDF.co uses an API key. This connector reads `PDFCO_API_KEY` and maps it to the official upstream MCP server's `X_API_KEY`. No OAuth scopes apply to this API-key integration; access is bounded by the PDF.co account/key and by this connector's fixed tool allowlist.

Environment variables:
- `PDFCO_API_KEY` — required secret; never expose to the LLM.
- `PDFCO_UVX_COMMAND` — optional, defaults to `uvx`.
- `PDFCO_REQUIRE_WRITE_APPROVAL` — defaults to `true`; setting `false` permits WRITE transformations without the per-call approval flag, but never bypasses HIGH_RISK approval.

## Tools and permissions

| Tool | Upstream official MCP tool | Risk | Approval |
|---|---|---|---|
| `pdf-co.pdf.convert-to-text` | `pdf_to_text` | READ | no |
| `pdf-co.pdf.convert-to-json` | `pdf_to_json` | READ | no |
| `pdf-co.pdf.info-read` | `pdf_info_reader` | READ | no |
| `pdf-co.pdf.form-fields-read` | `read_pdf_forms_info` | READ | no |
| `pdf-co.pdf.text-find` | `find_text` | READ | no |
| `pdf-co.pdf.merge` | `pdf_merge` | WRITE | configurable; default yes |
| `pdf-co.pdf.split` | `pdf_split` | WRITE | configurable; default yes |
| `pdf-co.pdf.make-searchable` | `pdf_make_searchable` | WRITE | configurable; default yes |
| `pdf-co.invoice.parse` | `ai_invoice_parser` | WRITE | configurable; default yes |
| `pdf-co.pdf.form-fill` | `fill_pdf_forms` | HIGH_RISK | always explicit |

No deletion, password removal, arbitrary API request, arbitrary upstream tool execution, or file-system upload tool is exposed. Transformations are classified WRITE because they consume provider credits and create provider-side temporary outputs. Form filling is HIGH_RISK because it can materially alter business documents.

## Validation and security

Inputs use strict bounded schemas. Source URLs must be HTTPS and local/private-network destinations are rejected to reduce SSRF exposure. Array sizes, field names, field values, search expressions and page-range strings are bounded. The upstream MCP tool set is fixed in code and newly discovered upstream tools are not trusted automatically. Provider-returned document text is untrusted data and cannot change connector permissions or approval policy.

Do not put secrets in prompts, tool parameters, logs or example files. PDF.co documentation notes that generated/output URLs are temporary; move needed outputs to an appropriate permanent store. Treat document contents as potentially malicious prompt-injection material.

## Reliability, rate limits and errors

The connector lets the official MCP implementation handle provider protocol details and propagates structured MCP/provider errors. READ calls receive at most three attempts for transient rate-limit/network/timeout-style failures with exponential backoff (250ms, 500ms). Mutating/credit-consuming WRITE and HIGH_RISK calls are never automatically retried, avoiding accidental duplicate transformations.

PDF.co rate limits are plan-dependent; official guidance published July 28, 2026 lists Free 5 req/s, Basic/Personal 10 req/s, Business 15 req/s and Enterprise 20 req/s. A 429 is treated as transient only for safe READ operations. PDF.co also charges credits by endpoint/page or call; design workflows to avoid unnecessary repeated processing. Async job/status capabilities exist upstream but are intentionally not exposed in this minimal connector.

## Testing

```bash
npm test
npm run build
```

Unit tests require no live credentials and cover credential failure, upstream allowlisting, permission/approval behavior, destructive-action denial, SSRF-oriented URL validation, and public HTTPS acceptance. Live upstream/provider integration tests are intentionally excluded from the default test suite because they require credentials and consume credits.

## Limitations

This connector exposes 10 high-value workflows rather than the entire PDF.co API/MCP surface. It requires the official local `pdfco-mcp` package through `uvx`; there is no remote MCP dependency. It does not implement REST fallback because all selected capabilities are present in the official MCP server. If a future official MCP release removes a required tool, startup fails safely instead of silently routing to an unverified capability. Output URLs and exact response fields remain controlled by PDF.co and should be treated as provider data.

See `examples/workflows.md` for request and output-shape examples.
