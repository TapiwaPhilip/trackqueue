
import React, { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { LocationService } from "@/services/LocationService";
import { Globe } from "lucide-react";
import { useClubs } from "@/context/ClubsContext";

// List of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
  "Comoros", "Congo", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", 
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", 
  "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
  "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", 
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", 
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
  "Yemen", "Zambia", "Zimbabwe"
];

const STORAGE_KEY = 'qtracker-country';

const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const { setUserLocation } = useClubs();

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        // First try to get from localStorage
        const savedCountry = localStorage.getItem(STORAGE_KEY);
        
        if (savedCountry) {
          setSelectedCountry(savedCountry);
          setLoading(false);
          return;
        }
        
        // If not in localStorage, detect from location service
        const locationData = await LocationService.getUserLocation();
        if (locationData && locationData.country) {
          setSelectedCountry(locationData.country);
          // Save to localStorage and update user location without showing toast
          localStorage.setItem(STORAGE_KEY, locationData.country);
          setUserLocation(locationData, false);
        } else {
          // Default to something if detection fails
          setSelectedCountry("United States");
          localStorage.setItem(STORAGE_KEY, "United States");
          setUserLocation({ city: "New York", country: "United States" }, false);
        }
      } catch (error) {
        console.error("Failed to detect country:", error);
        setSelectedCountry("United States");
        localStorage.setItem(STORAGE_KEY, "United States");
        setUserLocation({ city: "New York", country: "United States" }, false);
      } finally {
        setLoading(false);
      }
    };

    detectUserCountry();
  }, [setUserLocation]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    // Save to localStorage without showing toast
    localStorage.setItem(STORAGE_KEY, value);
    // Update user location without showing toast
    setUserLocation({ city: "", country: value }, false);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-nightMuted" />
      <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={loading}>
        <SelectTrigger className="h-8 w-[180px] bg-background/5 border-nightStroke text-sm">
          <SelectValue placeholder={loading ? "Detecting..." : "Select country"} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelector;
