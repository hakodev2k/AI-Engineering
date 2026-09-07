# Metabase connector examples

## Discover analytics content

Tool: `metabase.content.search`

```json
{"query":"monthly revenue","limit":20}
```

Permission: READ. Approval: no. Expected output: Metabase search response containing matching visible content.

## Explore a collection

Tool: `metabase.collection.items`

```json
{"collection_id":12,"limit":50,"offset":0,"model":"dashboard"}
```

Permission: READ. Approval: no. Expected output: bounded collection item page.

## Run a saved question

Tool: `metabase.question.run`

```json
{"card_id":42,"parameters":[]}
```

Permission: READ. Approval: no. Expected output: query result returned by Metabase.

## Search the semantic layer

Tool: `metabase.agent.search`

```json
{"query":"tables and metrics related to customer retention"}
```

Permission: READ. Approval: no. Expected output: Agent API search results for tables and metrics visible to the authenticated principal.

## Create an empty dashboard

Tool: `metabase.dashboard.create`

```json
{"name":"Retention Review","description":"Weekly retention review","collection_id":12,"approval":true}
```

Permission: WRITE. Approval: explicit human approval required. Expected output: created dashboard record.

## Create a native SQL question

Tool: `metabase.question.create_native`

```json
{"name":"Weekly signups","database_id":3,"collection_id":12,"sql":"select date_trunc('week', created_at) as week, count(*) as signups from users group by 1 order by 1","approval":true}
```

Permission: WRITE. Approval: explicit human approval required. Expected output: created saved question/card record. SQL is sent to the configured Metabase instance, not executed directly by the connector against a database.
