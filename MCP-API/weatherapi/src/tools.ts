import {z} from 'zod'; import {WeatherApiClient} from './client.js';
const q=z.string().trim().min(1).max(200); const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/); const yesno=z.enum(['yes','no']).default('no');
export const definitions=[
 ['weatherapi.location.search','Search matching cities/towns.',z.object({q}), 'search.json', (x:any)=>x],
 ['weatherapi.weather.current','Get current weather; optional air quality/pollen.',z.object({q,aqi:yesno,pollen:yesno}), 'current.json',(x:any)=>x],
 ['weatherapi.weather.forecast','Get 1-14 day forecast and optional alerts/AQI/pollen.',z.object({q,days:z.number().int().min(1).max(14),alerts:yesno,aqi:yesno,pollen:yesno}), 'forecast.json',(x:any)=>x],
 ['weatherapi.weather.history','Get historical weather for a date from 2010 onward (plan limits apply).',z.object({q,dt:date,hour:z.number().int().min(0).max(23).optional(),aqi:yesno,pollen:yesno}), 'history.json',(x:any)=>x],
 ['weatherapi.weather.future','Get future weather for a supported future date (plan limits apply).',z.object({q,dt:date}), 'future.json',(x:any)=>x],
 ['weatherapi.weather.alerts','Get government-issued weather alerts where available.',z.object({q}), 'alerts.json',(x:any)=>x],
 ['weatherapi.marine.forecast','Get marine forecast; optionally tides.',z.object({q,days:z.number().int().min(1).max(14).optional(),tides:yesno}), 'marine.json',(x:any)=>x],
 ['weatherapi.astronomy.get','Get sunrise, sunset and moon data for a date.',z.object({q,dt:date.optional()}), 'astronomy.json',(x:any)=>x],
 ['weatherapi.timezone.get','Get timezone/local-time metadata.',z.object({q}), 'timezone.json',(x:any)=>x],
 ['weatherapi.ip.lookup','Get geolocation metadata for an IPv4/IPv6 address.',z.object({q:z.string().ip()}), 'ip.json',(x:any)=>x]
] as const;
export function handlers(client=new WeatherApiClient()){return definitions.map(([name,description,schema,path])=>({name,description,schema,risk:'READ' as const,approval:false,run:async(input:unknown)=>client.get(path,schema.parse(input) as any)}));}
