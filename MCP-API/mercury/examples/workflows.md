# Mercury connector workflows

## Cash review
Tool: `mercury.account.list`
Input: `{}`
Permission: READ
Approval: No
Output: JSON envelope with `untrusted_provider_data: true` and Mercury account data.

Tool: `mercury.transaction.list`
Input: `{ "limit": 50, "offset": 0 }`
Permission: READ
Approval: No

## Invoice review
Tool: `mercury.invoice.list`
Input: `{ "limit": 25 }`
Permission: READ
Approval: No

## Create invoice
Tool: `mercury.invoice.create`
Permission: HIGH_RISK / WRITE
Approval: Yes. `MERCURY_ALLOW_WRITE=true` and the human-supplied approval token must match `MERCURY_APPROVAL_TOKEN`.
Example input fields: customerId, destinationAccountId, invoiceNumber, dueDate, currency, ACH/card flags, lineItems, approvalToken.
Expected output: the created Mercury invoice wrapped as untrusted provider data.

Never place the Mercury API token in a prompt or tool argument.
