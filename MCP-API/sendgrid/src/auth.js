export function authFromEnv(env=process.env){const key=env.SENDGRID_API_KEY?.trim();if(!key)throw new Error('SENDGRID_API_KEY is required');return {Authorization:`Bearer ${key}`};}
