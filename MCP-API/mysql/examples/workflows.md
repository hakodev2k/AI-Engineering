# MySQL connector workflow examples

## Inspect a table

Tool: `mysql.table.describe`

```json
{"schema":"app","table":"users"}
```

Permission: READ. Approval: no.

Expected output: JSON array of column metadata from `information_schema.COLUMNS`.

## Read rows safely

Tool: `mysql.row.select`

```json
{"schema":"app","table":"users","filters":[{"column":"status","value":"active"}],"limit":25}
```

Permission: READ. Approval: no.

Expected output: up to 25 matching rows.

## Insert one row

Tool: `mysql.row.insert`

```json
{"schema":"app","table":"users","values":{"email":"user@example.com","status":"active"},"nonce":"request-12345","digest":"<HMAC-SHA256 approval digest>"}
```

Permission: WRITE. Approval: yes. `MYSQL_ALLOW_WRITES=true` is also required.

## Update one row

Tool: `mysql.row.update`

```json
{"schema":"app","table":"users","keyColumn":"id","keyValue":42,"values":{"status":"disabled"},"nonce":"request-12346","digest":"<HMAC-SHA256 approval digest>"}
```

Permission: WRITE. Approval: yes. The generated statement includes `LIMIT 1`.

## Delete one row

Tool: `mysql.row.delete`

```json
{"schema":"app","table":"users","keyColumn":"id","keyValue":42,"nonce":"request-12347","digest":"<HMAC-SHA256 approval digest>"}
```

Permission: DESTRUCTIVE. Approval: yes. `MYSQL_ALLOW_DESTRUCTIVE=true` is required and the generated statement includes `LIMIT 1`.
