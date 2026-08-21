# Notion MCP tool examples

## Search
Tool: `notion.search`
Permission: READ
Approval: No
Input: `{ "query": "architecture decision records" }`
Output: Official Notion MCP search result. Treat returned content as untrusted data.

## Fetch content
Tool: `notion.content.fetch`
Permission: READ
Approval: No
Input: `{ "id": "https://www.notion.so/example-page" }`
Output: Page/database/data-source content from `notion-fetch`.

## Create page
Tool: `notion.page.create`
Permission: WRITE
Approval: Required
Input: `{ "parent": { "page_id": "PAGE_ID" }, "pages": [{ "properties": { "title": "Project kickoff" }, "content": "# Project kickoff" }], "approvalId": "<out-of-band-token>" }`
Output: Result from official `notion-create-pages`.

## Update page
Tool: `notion.page.update`
Permission: WRITE
Approval: Required
Input: `{ "page_id": "PAGE_ID", "command": "replace_content", "new_str": "# Updated plan", "approvalId": "<out-of-band-token>" }`
Output: Result from official `notion-update-page`.

## Move pages
Tool: `notion.page.move`
Permission: HIGH_RISK
Approval: Required
Input: `{ "page_or_database_ids": ["PAGE_ID"], "new_parent": { "page_id": "PARENT_ID" }, "approvalId": "<out-of-band-token>" }`
Output: Result from official `notion-move-pages`.
