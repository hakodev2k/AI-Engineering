# Webflow MCP connector examples

## Inspect a site's CMS structure

Tool: `webflow.site.list`

```json
{"limit":20,"offset":0}
```

Expected output: JSON containing accessible site records and pagination metadata. Permission: `READ`. Approval: none.

Then call `webflow.collection.list`:

```json
{"siteId":"0123456789abcdef01234567","limit":100,"offset":0}
```

Expected output: JSON containing the site's CMS collections. Permission: `READ`. Approval: none.

## Draft a CMS item

Tool: `webflow.item.create`

```json
{
  "collectionId":"0123456789abcdef01234567",
  "fieldData":{"name":"Draft article","slug":"draft-article","summary":"Prepared by an agent"},
  "isDraft":true,
  "approval":true
}
```

Expected output: the newly created staged CMS item. Permission: `WRITE`. Approval: configurable through `WEBFLOW_REQUIRE_WRITE_APPROVAL`; enabled by default. The operation does not publish public content.

## Review then publish CMS items

First use `webflow.item.get` to inspect the staged item. After a human approves publication, call:

```json
{
  "collectionId":"0123456789abcdef01234567",
  "itemIds":["89abcdef0123456701234567"],
  "approval":true
}
```

Expected output: Webflow's publish response. Permission: `WRITE`. Risk: `HIGH_RISK`. Approval: always required because publication changes public content.

## Publish a page or site

Tool: `webflow.site.publish`

```json
{
  "siteId":"0123456789abcdef01234567",
  "publishToWebflowSubdomain":true,
  "pageId":"89abcdef0123456701234567",
  "approval":true
}
```

Expected output: Webflow's accepted publish operation. Permission: `WRITE`. Risk: `HIGH_RISK`. Approval: always required. Webflow limits successful site publish operations to one per minute.

## Permanently delete a CMS item

Tool: `webflow.item.delete`

```json
{
  "collectionId":"0123456789abcdef01234567",
  "itemId":"89abcdef0123456701234567",
  "approval":true
}
```

Expected output: deletion response. Permission: `WRITE`. Risk: `DESTRUCTIVE`. Approval: always required, and `WEBFLOW_ALLOW_DESTRUCTIVE=true` must be configured explicitly. This action is disabled by default.
