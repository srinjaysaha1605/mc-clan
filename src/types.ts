export interface Player {
  id: string;
  display_order?: number;
  alias: string;
  quote: string;
  callsign: string;
  function: string;
  combatProfile: string;
  primaryWeapon: string;
  status: string;
  image: string;
  ultimate_image?: string;
}
