export interface LocationSuggestion {
  city: string;
  state?: string;
  country: string;
  displayName: string;
}

// Popular international cities for recruiting
export const LOCATION_DATA: LocationSuggestion[] = [
  // United States
  { city: "Miami", state: "FL", country: "US", displayName: "Miami, FL, US" },
  { city: "New York", state: "NY", country: "US", displayName: "New York, NY, US" },
  { city: "Los Angeles", state: "CA", country: "US", displayName: "Los Angeles, CA, US" },
  { city: "Chicago", state: "IL", country: "US", displayName: "Chicago, IL, US" },
  { city: "Houston", state: "TX", country: "US", displayName: "Houston, TX, US" },
  { city: "Phoenix", state: "AZ", country: "US", displayName: "Phoenix, AZ, US" },
  { city: "Philadelphia", state: "PA", country: "US", displayName: "Philadelphia, PA, US" },
  { city: "San Antonio", state: "TX", country: "US", displayName: "San Antonio, TX, US" },
  { city: "San Diego", state: "CA", country: "US", displayName: "San Diego, CA, US" },
  { city: "Dallas", state: "TX", country: "US", displayName: "Dallas, TX, US" },
  
  // Canada
  { city: "Toronto", state: "ON", country: "Canada", displayName: "Toronto, ON, Canada" },
  { city: "Vancouver", state: "BC", country: "Canada", displayName: "Vancouver, BC, Canada" },
  { city: "Montreal", state: "QC", country: "Canada", displayName: "Montreal, QC, Canada" },
  { city: "Calgary", state: "AB", country: "Canada", displayName: "Calgary, AB, Canada" },
  { city: "Ottawa", state: "ON", country: "Canada", displayName: "Ottawa, ON, Canada" },
  
  // United Kingdom
  { city: "London", country: "UK", displayName: "London, UK" },
  { city: "Manchester", country: "UK", displayName: "Manchester, UK" },
  { city: "Birmingham", country: "UK", displayName: "Birmingham, UK" },
  { city: "Edinburgh", country: "UK", displayName: "Edinburgh, UK" },
  { city: "Glasgow", country: "UK", displayName: "Glasgow, UK" },
  
  // Australia
  { city: "Sydney", state: "NSW", country: "Australia", displayName: "Sydney, NSW, Australia" },
  { city: "Melbourne", state: "VIC", country: "Australia", displayName: "Melbourne, VIC, Australia" },
  { city: "Brisbane", state: "QLD", country: "Australia", displayName: "Brisbane, QLD, Australia" },
  { city: "Perth", state: "WA", country: "Australia", displayName: "Perth, WA, Australia" },
  
  // India
  { city: "Mumbai", state: "Maharashtra", country: "India", displayName: "Mumbai, Maharashtra, India" },
  { city: "Delhi", state: "Delhi", country: "India", displayName: "Delhi, India" },
  { city: "Bangalore", state: "Karnataka", country: "India", displayName: "Bangalore, Karnataka, India" },
  { city: "Hyderabad", state: "Telangana", country: "India", displayName: "Hyderabad, Telangana, India" },
  { city: "Chennai", state: "Tamil Nadu", country: "India", displayName: "Chennai, Tamil Nadu, India" },
  { city: "Pune", state: "Maharashtra", country: "India", displayName: "Pune, Maharashtra, India" },
  
  // Philippines
  { city: "Manila", country: "Philippines", displayName: "Manila, Philippines" },
  { city: "Cebu City", country: "Philippines", displayName: "Cebu City, Philippines" },
  { city: "Davao", country: "Philippines", displayName: "Davao, Philippines" },
  { city: "Quezon City", country: "Philippines", displayName: "Quezon City, Philippines" },
  
  // Mexico
  { city: "Mexico City", country: "Mexico", displayName: "Mexico City, Mexico" },
  { city: "Guadalajara", country: "Mexico", displayName: "Guadalajara, Mexico" },
  { city: "Monterrey", country: "Mexico", displayName: "Monterrey, Mexico" },
  { city: "Tijuana", country: "Mexico", displayName: "Tijuana, Mexico" },
  
  // Other popular locations
  { city: "Berlin", country: "Germany", displayName: "Berlin, Germany" },
  { city: "Paris", country: "France", displayName: "Paris, France" },
  { city: "Amsterdam", country: "Netherlands", displayName: "Amsterdam, Netherlands" },
  { city: "Dublin", country: "Ireland", displayName: "Dublin, Ireland" },
  { city: "Tel Aviv", country: "Israel", displayName: "Tel Aviv, Israel" },
  { city: "Singapore", country: "Singapore", displayName: "Singapore" },
  { city: "Tokyo", country: "Japan", displayName: "Tokyo, Japan" },
  { city: "Seoul", country: "South Korea", displayName: "Seoul, South Korea" },
];

export const searchLocations = (query: string): LocationSuggestion[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return LOCATION_DATA.filter(location =>
    location.displayName.toLowerCase().includes(normalizedQuery) ||
    location.city.toLowerCase().includes(normalizedQuery) ||
    location.country.toLowerCase().includes(normalizedQuery) ||
    (location.state && location.state.toLowerCase().includes(normalizedQuery))
  ).slice(0, 10); // Return top 10 matches
};
