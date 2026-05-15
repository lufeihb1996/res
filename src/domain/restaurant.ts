export interface RestaurantProfile {
  id: string;
  name: string;
  cuisine: string;
  tagline?: string;
  phone: string;
  address: string;
  hours: string[];
  contactNotes?: string;
}
