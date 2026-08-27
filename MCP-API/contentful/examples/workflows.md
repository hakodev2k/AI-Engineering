# Contentful connector examples

## Inspect then update

1. Call `contentful.entry.get` (READ, no approval).
2. Use the returned current version to prepare the official `update_entry` payload.
3. Obtain an approval token bound to the exact `contentful.entry.update` payload.
4. Call `contentful.entry.update` (WRITE, approval required).
5. Re-read the entry and verify the provider result.

The input schema is inherited from the installed official Contentful MCP server at runtime.

## Publish

Tool: `contentful.entry.publish`  
Risk: HIGH_RISK  
Approval: required

Publishing changes externally visible content, so this wrapper requires explicit approval even though the official upstream MCP can publish directly.

## Delete

Tool: `contentful.entry.delete`  
Risk: DESTRUCTIVE  
Approval: required  
Additional gate: `CONTENTFUL_ENABLE_DESTRUCTIVE=true`

The official upstream tool also uses a two-phase preview/confirmation flow; this connector preserves it and adds its own approval boundary.
