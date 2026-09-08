export interface ToolMetadata { name:string; risk:'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE'; approval:boolean; purpose:string; }
export const TOOL_METADATA: ToolMetadata[] = [
  {name:'hetzner_cloud.server.list',risk:'READ',approval:false,purpose:'List servers'},
  {name:'hetzner_cloud.server.get',risk:'READ',approval:false,purpose:'Get one server'},
  {name:'hetzner_cloud.server.create',risk:'HIGH_RISK',approval:true,purpose:'Create a billable server'},
  {name:'hetzner_cloud.server.power_action',risk:'HIGH_RISK',approval:true,purpose:'Change server power state'},
  {name:'hetzner_cloud.server.delete',risk:'DESTRUCTIVE',approval:true,purpose:'Permanently delete a server'},
  {name:'hetzner_cloud.server_type.list',risk:'READ',approval:false,purpose:'List server types'},
  {name:'hetzner_cloud.image.list',risk:'READ',approval:false,purpose:'List images'},
  {name:'hetzner_cloud.location.list',risk:'READ',approval:false,purpose:'List locations'},
  {name:'hetzner_cloud.datacenter.list',risk:'READ',approval:false,purpose:'List datacenters'},
  {name:'hetzner_cloud.network.list',risk:'READ',approval:false,purpose:'List networks'},
  {name:'hetzner_cloud.firewall.list',risk:'READ',approval:false,purpose:'List firewalls'},
  {name:'hetzner_cloud.volume.list',risk:'READ',approval:false,purpose:'List volumes'},
  {name:'hetzner_cloud.ssh_key.list',risk:'READ',approval:false,purpose:'List SSH keys'}
];
