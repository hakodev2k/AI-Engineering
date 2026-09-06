# Example workflows

## Inspect an employee and payroll context

1. `gusto.employee.list`
   - Input: `{ "companyId": "<uuid>", "searchTerm": "Ada", "per": 25 }`
   - Permission: `employees:read`
   - Risk: READ
   - Approval: no
2. `gusto.employee.get`
   - Input: `{ "employeeId": "<uuid>", "include": ["company_name", "current_home_address"] }`
   - Permission: `employees:read`
   - Risk: READ
   - Approval: no
3. `gusto.payroll.list`
   - Input: `{ "companyId": "<uuid>", "processingStatuses": ["unprocessed"], "per": 25 }`
   - Permission: `payrolls:read`
   - Risk: READ
   - Approval: no

Expected output shape: `{ "data": <provider response>, "meta": { "rateLimitLimit": ..., "rateLimitRemaining": ..., "rateLimitReset": ... } }`.

## Prepare a payroll for editing

1. Read the target payroll with `gusto.payroll.get`.
2. Have a human review the target company, payroll UUID, and employee set.
3. Add `gusto.payroll.prepare:<companyId>:<payrollId>` to `GUSTO_APPROVED_ACTIONS`.
4. Call `gusto.payroll.prepare` with `{ "companyId": "<uuid>", "payrollId": "<uuid>", "employeeUuids": ["<uuid>"] }`.

Permission: `payrolls:write employees:read`. Risk: HIGH_RISK. Approval: always required.

## Create an employee record

1. Review identity/contact data outside the model context when it contains sensitive fields.
2. Add `gusto.employee.create:<companyId>:<email-or-workEmail-or-firstName>` to `GUSTO_APPROVED_ACTIONS`.
3. Call `gusto.employee.create`.

Permission: `employees:manage`. Risk: HIGH_RISK. Approval: always required.
