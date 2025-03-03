export interface Kosten {
  id: string;
  huisdieren: Huisdieren;
  hobbies: Hobbies;
  eten: Eten;
  totaal: number;
}

export interface Huisdieren {
  alpacas: number;
  honden: number;
  percTotaal: number;
  totaal: number;
}

export interface Hobbies {
  knutselen: number;
  gamen: number;
  percTotaal: number;
  totaal: number;
}

export interface Eten {
  boodschappen: number;
  uiteten: number;
  percTotaal: number;
  totaal: number;
}
