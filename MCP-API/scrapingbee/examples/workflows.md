# ScrapingBee connector workflow examples

Provider-returned content is always marked as untrusted data by the connector.

## Read a page as Markdown

Tool: `scrapingbee.page.text`

Permission: `scrape:read`  
Risk: `READ`  
Approval: none for standard requests; premium/stealth proxy options require an operator grant by default.

```json
{
  "url": "https://example.com/docs"
}
```

Expected output shape:

```json
{
  "ok": true,
  "data": {
    "contentType": "text/markdown",
    "text": "..."
  },
  "untrustedProviderData": true
}
```

## Extract structured fields

Tool: `scrapingbee.page.extract`

```json
{
  "url": "https://example.com/product",
  "rules": {
    "title": "h1",
    "price": ".price"
  }
}
```

## General web search

Tool: `scrapingbee.search.web`

```json
{
  "query": "Model Context Protocol security guidance",
  "countryCode": "us"
}
```

The connector prefers the official hosted MCP `fast_search` tool. If MCP is unavailable it falls back to the official Google classic search API.

## Google News search

Tool: `scrapingbee.search.google.news`

```json
{
  "query": "semiconductor export controls",
  "countryCode": "us",
  "device": "desktop"
}
```

## Screenshot with premium proxy

Tool: `scrapingbee.page.screenshot`

```json
{
  "url": "https://example.com",
  "fullPage": true,
  "premiumProxy": true,
  "costApprovalId": "<host-supplied-approval-grant>"
}
```

REST fallback returns binary screenshots as base64 with an explicit `encoding` field. Do not place `SCRAPINGBEE_API_KEY` in tool arguments.
