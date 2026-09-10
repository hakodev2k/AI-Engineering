# Pingdom connector workflows

## Diagnose an uptime check

Tool: `pingdom.check.list`

Input:
```json
{"tags":"production","includeTags":true,"limit":50,"offset":0}
```

Permission: `READ`. Approval: no. Output is an MCP text result containing `{source:"pingdom",untrusted:true,status,data}`.

Then call `pingdom.check.get` with the selected `checkId`, followed by `pingdom.check.summary` with a bounded Unix-time range.

## Schedule maintenance

Tool: `pingdom.maintenance.create`

Input before approval:
```json
{"description":"Database maintenance","from":1790000000,"to":1790003600,"uptimeIds":[123]}
```

Permission: `WRITE`. Approval: yes. A trusted human/operator computes the HMAC approval digest outside the model using `PINGDOM_APPROVAL_SECRET` over the exact tool name and arguments, then supplies the resulting 64-character digest in `approval`.

## Delete a check

Tool: `pingdom.check.delete`

Input before approval:
```json
{"checkId":123}
```

Permission: `DESTRUCTIVE`. Approval: yes. The tool is also disabled unless the operator sets `PINGDOM_ENABLE_DESTRUCTIVE=true`. The upstream operation is irreversible and deletes collected check data.
