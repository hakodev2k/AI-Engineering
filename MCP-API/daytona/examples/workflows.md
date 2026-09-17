# Daytona MCP workflow examples

`daytona.sandbox.list` — input `{}` — READ — no approval. Output is an array of `{id,name,state}`.

`daytona.sandbox.create` — input `{"name":"agent-task","ttlMinutes":60,"networkBlockAll":true,"approved":true}` — WRITE — approval configurable. Output `{id,name,state}`.

`daytona.sandbox.execute` — input `{"sandbox":"agent-task","command":"npm test","timeoutSeconds":120,"approved":true}` — HIGH_RISK — explicit approval. Output `{exitCode,result}`.

`daytona.sandbox.delete` — input `{"sandbox":"agent-task","approved":true}` — DESTRUCTIVE — explicit approval and policy enablement. Output `{ok:true}`.
