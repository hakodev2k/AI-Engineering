export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export const POLICY={
 'deel.contract.list':{upstream:'listOfContracts',risk:'READ'},
 'deel.contract.get':{upstream:'retrieveASingleContract',risk:'READ'},
 'deel.people.list':{upstream:'getListOfPeople',risk:'READ'},
 'deel.people.get':{upstream:'getHrisProfilePerson',risk:'READ'},
 'deel.time_off.list':{upstream:'getTimeOffRequests',risk:'READ'},
 'deel.time_off.create':{upstream:'createTimeOffRequest',risk:'WRITE'},
 'deel.time_off.cancel':{upstream:'cancelTimeOffRequest',risk:'DESTRUCTIVE'},
 'deel.invoice.list':{upstream:'getInvoiceList',risk:'READ'},
 'deel.organization.get':{upstream:'getCurrentOrganization',risk:'READ'},
 'deel.country.list':{upstream:'retrieveCountries',risk:'READ'}
} as const;
export function authorize(risk:Risk,approved:boolean,env:NodeJS.ProcessEnv=process.env){if(risk==='READ')return;if(!approved)throw new Error('Explicit human approval is required');if((risk==='WRITE'||risk==='HIGH_RISK'||risk==='DESTRUCTIVE')&&env.DEEL_ALLOW_WRITE!=='true')throw new Error('Writes are disabled');if(risk==='HIGH_RISK'&&env.DEEL_ALLOW_HIGH_RISK!=='true')throw new Error('High-risk operations are disabled');if(risk==='DESTRUCTIVE'&&env.DEEL_ALLOW_DESTRUCTIVE!=='true')throw new Error('Destructive operations are disabled');}