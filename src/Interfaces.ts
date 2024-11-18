export interface Hero {
  hero_id: number;
  hero_name: string;
  is_xman: boolean;
  was_snapped: boolean;
}

export interface Hero_power {
  hero_id: number;
  hero_power: string;
}

export interface HeroWithPowers extends Hero, Hero_power {}
