# GIPHY MCP examples

## Search GIFs

Tool: `giphy.gif.search`

```json
{
  "q": "shipping success",
  "limit": 10,
  "rating": "g",
  "lang": "en",
  "country_code": "US"
}
```

Permission: READ. Approval: not required. Expected output is the official GIPHY JSON response containing `data`, `pagination`, and `meta`.

## Translate phrase to GIF

Tool: `giphy.gif.translate`

```json
{
  "s": "great job team",
  "rating": "g"
}
```

Permission: READ. Approval: not required. Expected output contains one GIF object in `data` plus provider metadata.

## Related tags

Tool: `giphy.tag.related`

```json
{
  "term": "celebrate"
}
```

Permission: READ. Approval: not required. Expected output contains related term objects from GIPHY.
