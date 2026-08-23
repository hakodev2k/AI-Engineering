# Xero tool examples

`xero.contact.list` takes `{}` and is READ-only.

`xero.contact.create` accepts `name`, optional `email`, and optional `phone`. It is WRITE and only runs when an operator configures `XERO_WRITE_MODE=allow`.

`xero.invoice.create_draft` accepts a contact UUID, invoice type (`ACCREC` or `ACCPAY`), one to fifty validated line items, and optional reference/date. It is a HIGH_RISK financial write and only runs when an operator configures `XERO_WRITE_MODE=allow`.

The wrapper intentionally does not expose payment creation, invoice approval, deletion, payroll writes, or bank-transaction writes.
