import citiesData from './indianCities.json';

export interface IndianCity {
  id: string;
  name: string;
  state: string;
}

/** 1,220+ Indian cities with state — sourced from public Indian cities dataset. */
export const INDIAN_CITIES: IndianCity[] = citiesData as IndianCity[];

export const INDIAN_CITY_OPTIONS = INDIAN_CITIES.map((city) => ({
  id: city.id,
  title: city.name,
  subtitle: city.state,
}));

export function cityNameById(id: string): string | undefined {
  return INDIAN_CITIES.find((c) => c.id === id)?.name;
}

export function cityById(id: string): IndianCity | undefined {
  return INDIAN_CITIES.find((c) => c.id === id);
}
