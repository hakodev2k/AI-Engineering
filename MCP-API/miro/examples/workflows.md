# Miro connector workflows

## Search boards
Tool: `miro.board.list`  
Permission: READ  
Approval: no
```json
{"query":"architecture","limit":20,"offset":0}
```

## Read board items
Tool: `miro.board.items.list`  
Permission: READ  
Approval: no
```json
{"boardId":"uXjVExample=","type":"sticky_note","limit":20}
```

## Create a sticky note
Tool: `miro.sticky_note.create`  
Permission: WRITE  
Approval: required
```json
{
  "boardId":"uXjVExample=",
  "data":{"content":"Validate rollback plan","shape":"square"},
  "position":{"x":100,"y":200,"origin":"center"},
  "approval_token":"<payload-bound HMAC-SHA256>"
}
```

## Update a shape
Tool: `miro.shape.update`  
Permission: WRITE  
Approval: required
```json
{
  "boardId":"uXjVExample=",
  "itemId":"3458764512345678901",
  "data":{"content":"API gateway","shape":"round_rectangle"},
  "approval_token":"<payload-bound HMAC-SHA256>"
}
```

## Delete a text item
Tool: `miro.text.delete`  
Permission: DESTRUCTIVE  
Approval: required  
Additional gate: `MIRO_ENABLE_DESTRUCTIVE=true`
```json
{
  "boardId":"uXjVExample=",
  "itemId":"3458764512345678902",
  "approval_token":"<payload-bound HMAC-SHA256>"
}
```

All provider-returned board content is marked as untrusted external data.
