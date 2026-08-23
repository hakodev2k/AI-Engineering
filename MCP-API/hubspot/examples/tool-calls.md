# HubSpot MCP tool examples

## Search contacts

Tool: `hubspot.contact.search`

```json
{"query":"alice@example.com","properties":["email","firstname","lastname"],"limit":20}
```

Permission: READ. Approval: no.

Expected shape: HubSpot CRM search response with `results`, `total`, and optional paging data.

## Create a contact

Tool: `hubspot.contact.create`

```json
{"properties":{"email":"alice@example.com","firstname":"Alice","lastname":"Nguyen"},"approval":"APPROVE"}
```

Permission: WRITE. Approval: yes by default. `HUBSPOT_ALLOW_WRITES=true` must also be configured.

Expected shape: created HubSpot CRM object with its `id`, `properties`, timestamps, and archive state.

## Update a deal

Tool: `hubspot.deal.update`

```json
{"id":"123456","properties":{"dealstage":"closedwon"},"approval":"APPROVE"}
```

Permission: WRITE. Approval: yes by default.

Expected shape: updated HubSpot deal record. Pipeline/stage values must already be valid for the target account.

## List owners

Tool: `hubspot.owner.list`

```json
{"limit":100,"archived":false}
```

Permission: READ. Approval: no.

Expected shape: owner collection plus paging when additional owners exist.
