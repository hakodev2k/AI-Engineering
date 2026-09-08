# Semgrep connector examples

All tools are `READ`; no execution approval is required because this connector intentionally exposes no Semgrep policy mutations, token administration, triage mutations, or deletion operations.

## Scan generated code
Tool: `semgrep.scan.content`
Input: `{"input":{"files":[{"path":"app.py","content":"import subprocess\nsubprocess.call(user_input, shell=True)"}]}}`
Expected output: the official Semgrep MCP scan result envelope, including findings and scanned paths.

## Review existing SAST findings
Tool: `semgrep.finding.code.list`
Input: `{"input":{"repositories":["owner/repository"],"severities":["SEVERITY_CRITICAL","SEVERITY_HIGH"],"limit":20}}`
Expected output: bounded findings from Semgrep AppSec Platform. Requires `SEMGREP_APP_TOKEN` with the provider permissions required by the official findings tool.

## Dependency check
Tool: `semgrep.scan.supply_chain`
Input: `{}`
Expected output: the official Semgrep Supply Chain scan result for the active workspace.
