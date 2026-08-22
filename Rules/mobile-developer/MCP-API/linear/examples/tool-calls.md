# Linear MCP tool examples

## List issues
Tool: `linear.issue.list`
Permission: READ
Approval: No
Input: `{ "query": "authentication", "teamId": "team-id", "limit": 20 }`
Output: Linear MCP issue list/search result.

## Get issue
Tool: `linear.issue.get`
Permission: READ
Approval: No
Input: `{ "id": "ENG-123" }`
Output: Linear issue details.

## Save issue
Tool: `linear.issue.save`
Permission: WRITE
Approval: Required
Input: `{ "id": "ENG-123", "title": "Updated title", "approvalId": "<out-of-band-hmac>" }`
Output: Updated issue result from Linear MCP.

## List projects
Tool: `linear.project.list`
Permission: READ
Approval: No
Input: `{ "teamId": "team-id", "limit": 20 }`
Output: Project list/search result.

## Save project
Tool: `linear.project.save`
Permission: WRITE
Approval: Required
Input: `{ "id": "project-id", "summary": "Updated summary", "approvalId": "<out-of-band-hmac>" }`
Output: Updated project result.

## Save document
Tool: `linear.document.save`
Permission: WRITE
Approval: Required
Input: `{ "projectId": "project-id", "title": "Architecture notes", "content": "# Notes", "approvalId": "<out-of-band-hmac>" }`
Output: Created or updated Linear document.

Approval IDs are generated outside the LLM boundary as HMAC-SHA256 of the exact tool name using `LINEAR_APPROVAL_SECRET`.
