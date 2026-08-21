# GitHub MCP tool examples

## Read a file
Tool: `github.file.read`
Permission: READ
Approval: No
Input: `{ "owner": "octocat", "repo": "hello-world", "path": "README.md" }`
Output: Official GitHub MCP `get_file_contents` result wrapped as connector output.

## Search issues
Tool: `github.issue.search`
Permission: READ
Approval: No
Input: `{ "query": "is:issue is:open label:bug", "owner": "octocat", "repo": "hello-world", "perPage": 20 }`
Output: Matching issue search results.

## Create an issue
Tool: `github.issue.create`
Permission: WRITE
Approval: Required
Input: `{ "owner": "octocat", "repo": "hello-world", "title": "Example issue", "body": "Created through the connector", "approvalId": "<out-of-band-hmac>" }`
Output: Created issue result from the official GitHub MCP server.

## Create a pull request
Tool: `github.pull_request.create`
Permission: WRITE
Approval: Required
Input: `{ "owner": "octocat", "repo": "hello-world", "title": "Example PR", "head": "feature/example", "base": "main", "draft": true, "approvalId": "<out-of-band-hmac>" }`
Output: Created pull request result.

## Merge a pull request
Tool: `github.pull_request.merge`
Permission: HIGH_RISK
Approval: Always required
Input: `{ "owner": "octocat", "repo": "hello-world", "pullNumber": 42, "mergeMethod": "squash", "approvalId": "<out-of-band-hmac>" }`
Output: Merge result. A timeout must be treated as an unknown outcome and checked before retrying.

Approval IDs are generated outside the LLM boundary as HMAC-SHA256 of the exact tool name using `GITHUB_APPROVAL_SECRET`. Never expose that secret to the model.
