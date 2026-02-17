"""
Seed all 193 UN-recognized countries into Supabase
Uses ISO-3166-1 alpha-2 codes (matching existing schema)
"""
import os
from supabase import create_client, Client
from datetime import datetime

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# All 193 UN-recognized countries with ISO-3166-1 alpha-2 codes
COUNTRIES = [
    # Africa
    {"name": "Algeria", "iso_code": "DZ", "region": "Africa", "capital": "Algiers", "regime_type": "Semi-Presidential Republic"},
    {"name": "Angola", "iso_code": "AO", "region": "Africa", "capital": "Luanda", "regime_type": "Presidential Republic"},
    {"name": "Benin", "iso_code": "BJ", "region": "Africa", "capital": "Porto-Novo", "regime_type": "Presidential Republic"},
    {"name": "Botswana", "iso_code": "BW", "region": "Africa", "capital": "Gaborone", "regime_type": "Parliamentary Republic"},
    {"name": "Burkina Faso", "iso_code": "BF", "region": "Africa", "capital": "Ouagadougou", "regime_type": "Military Junta"},
    {"name": "Burundi", "iso_code": "BI", "region": "Africa", "capital": "Gitega", "regime_type": "Presidential Republic"},
    {"name": "Cameroon", "iso_code": "CM", "region": "Africa", "capital": "Yaoundé", "regime_type": "Presidential Republic"},
    {"name": "Cape Verde", "iso_code": "CV", "region": "Africa", "capital": "Praia", "regime_type": "Semi-Presidential Republic"},
    {"name": "Central African Republic", "iso_code": "CF", "region": "Africa", "capital": "Bangui", "regime_type": "Presidential Republic"},
    {"name": "Chad", "iso_code": "TD", "region": "Africa", "capital": "N'Djamena", "regime_type": "Presidential Republic"},
    {"name": "Comoros", "iso_code": "KM", "region": "Africa", "capital": "Moroni", "regime_type": "Presidential Republic"},
    {"name": "Congo, Republic of the", "iso_code": "CG", "region": "Africa", "capital": "Brazzaville", "regime_type": "Presidential Republic"},
    {"name": "Congo, Democratic Republic of the", "iso_code": "CD", "region": "Africa", "capital": "Kinshasa", "regime_type": "Presidential Republic"},
    {"name": "Djibouti", "iso_code": "DJ", "region": "Africa", "capital": "Djibouti", "regime_type": "Presidential Republic"},
    {"name": "Egypt", "iso_code": "EG", "region": "Africa", "capital": "Cairo", "regime_type": "Semi-Presidential Republic"},
    {"name": "Equatorial Guinea", "iso_code": "GQ", "region": "Africa", "capital": "Malabo", "regime_type": "Presidential Republic"},
    {"name": "Eritrea", "iso_code": "ER", "region": "Africa", "capital": "Asmara", "regime_type": "One-Party State"},
    {"name": "Eswatini", "iso_code": "SZ", "region": "Africa", "capital": "Mbabane", "regime_type": "Absolute Monarchy"},
    {"name": "Ethiopia", "iso_code": "ET", "region": "Africa", "capital": "Addis Ababa", "regime_type": "Parliamentary Republic"},
    {"name": "Gabon", "iso_code": "GA", "region": "Africa", "capital": "Libreville", "regime_type": "Military Junta"},
    {"name": "Gambia", "iso_code": "GM", "region": "Africa", "capital": "Banjul", "regime_type": "Presidential Republic"},
    {"name": "Ghana", "iso_code": "GH", "region": "Africa", "capital": "Accra", "regime_type": "Presidential Republic"},
    {"name": "Guinea", "iso_code": "GN", "region": "Africa", "capital": "Conakry", "regime_type": "Military Junta"},
    {"name": "Guinea-Bissau", "iso_code": "GW", "region": "Africa", "capital": "Bissau", "regime_type": "Semi-Presidential Republic"},
    {"name": "Ivory Coast", "iso_code": "CI", "region": "Africa", "capital": "Yamoussoukro", "regime_type": "Presidential Republic"},
    {"name": "Kenya", "iso_code": "KE", "region": "Africa", "capital": "Nairobi", "regime_type": "Presidential Republic"},
    {"name": "Lesotho", "iso_code": "LS", "region": "Africa", "capital": "Maseru", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Liberia", "iso_code": "LR", "region": "Africa", "capital": "Monrovia", "regime_type": "Presidential Republic"},
    {"name": "Libya", "iso_code": "LY", "region": "Africa", "capital": "Tripoli", "regime_type": "Transitional Government"},
    {"name": "Madagascar", "iso_code": "MG", "region": "Africa", "capital": "Antananarivo", "regime_type": "Semi-Presidential Republic"},
    {"name": "Malawi", "iso_code": "MW", "region": "Africa", "capital": "Lilongwe", "regime_type": "Presidential Republic"},
    {"name": "Mali", "iso_code": "ML", "region": "Africa", "capital": "Bamako", "regime_type": "Military Junta"},
    {"name": "Mauritania", "iso_code": "MR", "region": "Africa", "capital": "Nouakchott", "regime_type": "Presidential Republic"},
    {"name": "Mauritius", "iso_code": "MU", "region": "Africa", "capital": "Port Louis", "regime_type": "Parliamentary Republic"},
    {"name": "Morocco", "iso_code": "MA", "region": "Africa", "capital": "Rabat", "regime_type": "Constitutional Monarchy"},
    {"name": "Mozambique", "iso_code": "MZ", "region": "Africa", "capital": "Maputo", "regime_type": "Presidential Republic"},
    {"name": "Namibia", "iso_code": "NA", "region": "Africa", "capital": "Windhoek", "regime_type": "Presidential Republic"},
    {"name": "Niger", "iso_code": "NE", "region": "Africa", "capital": "Niamey", "regime_type": "Military Junta"},
    {"name": "Nigeria", "iso_code": "NG", "region": "Africa", "capital": "Abuja", "regime_type": "Presidential Republic"},
    {"name": "Rwanda", "iso_code": "RW", "region": "Africa", "capital": "Kigali", "regime_type": "Presidential Republic"},
    {"name": "São Tomé and Príncipe", "iso_code": "ST", "region": "Africa", "capital": "São Tomé", "regime_type": "Semi-Presidential Republic"},
    {"name": "Senegal", "iso_code": "SN", "region": "Africa", "capital": "Dakar", "regime_type": "Presidential Republic"},
    {"name": "Seychelles", "iso_code": "SC", "region": "Africa", "capital": "Victoria", "regime_type": "Presidential Republic"},
    {"name": "Sierra Leone", "iso_code": "SL", "region": "Africa", "capital": "Freetown", "regime_type": "Presidential Republic"},
    {"name": "Somalia", "iso_code": "SO", "region": "Africa", "capital": "Mogadishu", "regime_type": "Parliamentary Republic"},
    {"name": "South Africa", "iso_code": "ZA", "region": "Africa", "capital": "Pretoria", "regime_type": "Parliamentary Republic"},
    {"name": "South Sudan", "iso_code": "SS", "region": "Africa", "capital": "Juba", "regime_type": "Presidential Republic"},
    {"name": "Sudan", "iso_code": "SD", "region": "Africa", "capital": "Khartoum", "regime_type": "Military Junta"},
    {"name": "Tanzania", "iso_code": "TZ", "region": "Africa", "capital": "Dodoma", "regime_type": "Presidential Republic"},
    {"name": "Togo", "iso_code": "TG", "region": "Africa", "capital": "Lomé", "regime_type": "Presidential Republic"},
    {"name": "Tunisia", "iso_code": "TN", "region": "Africa", "capital": "Tunis", "regime_type": "Presidential Republic"},
    {"name": "Uganda", "iso_code": "UG", "region": "Africa", "capital": "Kampala", "regime_type": "Presidential Republic"},
    {"name": "Zambia", "iso_code": "ZM", "region": "Africa", "capital": "Lusaka", "regime_type": "Presidential Republic"},
    {"name": "Zimbabwe", "iso_code": "ZW", "region": "Africa", "capital": "Harare", "regime_type": "Presidential Republic"},
    
    # Asia
    {"name": "Afghanistan", "iso_code": "AF", "region": "Asia", "capital": "Kabul", "regime_type": "Islamic Emirate"},
    {"name": "Bahrain", "iso_code": "BH", "region": "Asia", "capital": "Manama", "regime_type": "Constitutional Monarchy"},
    {"name": "Bangladesh", "iso_code": "BD", "region": "Asia", "capital": "Dhaka", "regime_type": "Parliamentary Republic"},
    {"name": "Bhutan", "iso_code": "BT", "region": "Asia", "capital": "Thimphu", "regime_type": "Constitutional Monarchy"},
    {"name": "Brunei", "iso_code": "BN", "region": "Asia", "capital": "Bandar Seri Begawan", "regime_type": "Absolute Monarchy"},
    {"name": "Cambodia", "iso_code": "KH", "region": "Asia", "capital": "Phnom Penh", "regime_type": "Constitutional Monarchy"},
    {"name": "China", "iso_code": "CN", "region": "Asia", "capital": "Beijing", "regime_type": "One-Party State"},
    {"name": "India", "iso_code": "IN", "region": "Asia", "capital": "New Delhi", "regime_type": "Parliamentary Republic"},
    {"name": "Indonesia", "iso_code": "ID", "region": "Asia", "capital": "Jakarta", "regime_type": "Presidential Republic"},
    {"name": "Iran", "iso_code": "IR", "region": "Asia", "capital": "Tehran", "regime_type": "Theocratic Republic"},
    {"name": "Iraq", "iso_code": "IQ", "region": "Asia", "capital": "Baghdad", "regime_type": "Parliamentary Republic"},
    {"name": "Israel", "iso_code": "IL", "region": "Asia", "capital": "Jerusalem", "regime_type": "Parliamentary Republic"},
    {"name": "Japan", "iso_code": "JP", "region": "Asia", "capital": "Tokyo", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Jordan", "iso_code": "JO", "region": "Asia", "capital": "Amman", "regime_type": "Constitutional Monarchy"},
    {"name": "Kazakhstan", "iso_code": "KZ", "region": "Asia", "capital": "Astana", "regime_type": "Presidential Republic"},
    {"name": "Kuwait", "iso_code": "KW", "region": "Asia", "capital": "Kuwait City", "regime_type": "Constitutional Monarchy"},
    {"name": "Kyrgyzstan", "iso_code": "KG", "region": "Asia", "capital": "Bishkek", "regime_type": "Presidential Republic"},
    {"name": "Laos", "iso_code": "LA", "region": "Asia", "capital": "Vientiane", "regime_type": "One-Party State"},
    {"name": "Lebanon", "iso_code": "LB", "region": "Asia", "capital": "Beirut", "regime_type": "Parliamentary Republic"},
    {"name": "Malaysia", "iso_code": "MY", "region": "Asia", "capital": "Kuala Lumpur", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Maldives", "iso_code": "MV", "region": "Asia", "capital": "Malé", "regime_type": "Presidential Republic"},
    {"name": "Mongolia", "iso_code": "MN", "region": "Asia", "capital": "Ulaanbaatar", "regime_type": "Parliamentary Republic"},
    {"name": "Myanmar", "iso_code": "MM", "region": "Asia", "capital": "Naypyidaw", "regime_type": "Military Junta"},
    {"name": "Nepal", "iso_code": "NP", "region": "Asia", "capital": "Kathmandu", "regime_type": "Parliamentary Republic"},
    {"name": "North Korea", "iso_code": "KP", "region": "Asia", "capital": "Pyongyang", "regime_type": "One-Party State"},
    {"name": "Oman", "iso_code": "OM", "region": "Asia", "capital": "Muscat", "regime_type": "Absolute Monarchy"},
    {"name": "Pakistan", "iso_code": "PK", "region": "Asia", "capital": "Islamabad", "regime_type": "Parliamentary Republic"},
    {"name": "Palestine", "iso_code": "PS", "region": "Asia", "capital": "Ramallah", "regime_type": "Semi-Presidential Republic"},
    {"name": "Philippines", "iso_code": "PH", "region": "Asia", "capital": "Manila", "regime_type": "Presidential Republic"},
    {"name": "Qatar", "iso_code": "QA", "region": "Asia", "capital": "Doha", "regime_type": "Absolute Monarchy"},
    {"name": "Saudi Arabia", "iso_code": "SA", "region": "Asia", "capital": "Riyadh", "regime_type": "Absolute Monarchy"},
    {"name": "Singapore", "iso_code": "SG", "region": "Asia", "capital": "Singapore", "regime_type": "Parliamentary Republic"},
    {"name": "South Korea", "iso_code": "KR", "region": "Asia", "capital": "Seoul", "regime_type": "Presidential Republic"},
    {"name": "Sri Lanka", "iso_code": "LK", "region": "Asia", "capital": "Colombo", "regime_type": "Presidential Republic"},
    {"name": "Syria", "iso_code": "SY", "region": "Asia", "capital": "Damascus", "regime_type": "Presidential Republic"},
    {"name": "Tajikistan", "iso_code": "TJ", "region": "Asia", "capital": "Dushanbe", "regime_type": "Presidential Republic"},
    {"name": "Thailand", "iso_code": "TH", "region": "Asia", "capital": "Bangkok", "regime_type": "Constitutional Monarchy"},
    {"name": "Timor-Leste", "iso_code": "TL", "region": "Asia", "capital": "Dili", "regime_type": "Semi-Presidential Republic"},
    {"name": "Turkey", "iso_code": "TR", "region": "Asia", "capital": "Ankara", "regime_type": "Presidential Republic"},
    {"name": "Turkmenistan", "iso_code": "TM", "region": "Asia", "capital": "Ashgabat", "regime_type": "Presidential Republic"},
    {"name": "United Arab Emirates", "iso_code": "AE", "region": "Asia", "capital": "Abu Dhabi", "regime_type": "Federal Absolute Monarchy"},
    {"name": "Uzbekistan", "iso_code": "UZ", "region": "Asia", "capital": "Tashkent", "regime_type": "Presidential Republic"},
    {"name": "Vietnam", "iso_code": "VN", "region": "Asia", "capital": "Hanoi", "regime_type": "One-Party State"},
    {"name": "Yemen", "iso_code": "YE", "region": "Asia", "capital": "Sana'a", "regime_type": "Transitional Government"},
    
    # Europe
    {"name": "Albania", "iso_code": "AL", "region": "Europe", "capital": "Tirana", "regime_type": "Parliamentary Republic"},
    {"name": "Andorra", "iso_code": "AD", "region": "Europe", "capital": "Andorra la Vella", "regime_type": "Parliamentary Co-Principality"},
    {"name": "Armenia", "iso_code": "AM", "region": "Europe", "capital": "Yerevan", "regime_type": "Parliamentary Republic"},
    {"name": "Austria", "iso_code": "AT", "region": "Europe", "capital": "Vienna", "regime_type": "Parliamentary Republic"},
    {"name": "Azerbaijan", "iso_code": "AZ", "region": "Europe", "capital": "Baku", "regime_type": "Presidential Republic"},
    {"name": "Belarus", "iso_code": "BY", "region": "Europe", "capital": "Minsk", "regime_type": "Presidential Republic"},
    {"name": "Belgium", "iso_code": "BE", "region": "Europe", "capital": "Brussels", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Bosnia and Herzegovina", "iso_code": "BA", "region": "Europe", "capital": "Sarajevo", "regime_type": "Parliamentary Republic"},
    {"name": "Bulgaria", "iso_code": "BG", "region": "Europe", "capital": "Sofia", "regime_type": "Parliamentary Republic"},
    {"name": "Croatia", "iso_code": "HR", "region": "Europe", "capital": "Zagreb", "regime_type": "Parliamentary Republic"},
    {"name": "Cyprus", "iso_code": "CY", "region": "Europe", "capital": "Nicosia", "regime_type": "Presidential Republic"},
    {"name": "Czech Republic", "iso_code": "CZ", "region": "Europe", "capital": "Prague", "regime_type": "Parliamentary Republic"},
    {"name": "Denmark", "iso_code": "DK", "region": "Europe", "capital": "Copenhagen", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Estonia", "iso_code": "EE", "region": "Europe", "capital": "Tallinn", "regime_type": "Parliamentary Republic"},
    {"name": "Finland", "iso_code": "FI", "region": "Europe", "capital": "Helsinki", "regime_type": "Parliamentary Republic"},
    {"name": "France", "iso_code": "FR", "region": "Europe", "capital": "Paris", "regime_type": "Semi-Presidential Republic"},
    {"name": "Georgia", "iso_code": "GE", "region": "Europe", "capital": "Tbilisi", "regime_type": "Parliamentary Republic"},
    {"name": "Germany", "iso_code": "DE", "region": "Europe", "capital": "Berlin", "regime_type": "Parliamentary Republic"},
    {"name": "Greece", "iso_code": "GR", "region": "Europe", "capital": "Athens", "regime_type": "Parliamentary Republic"},
    {"name": "Hungary", "iso_code": "HU", "region": "Europe", "capital": "Budapest", "regime_type": "Parliamentary Republic"},
    {"name": "Iceland", "iso_code": "IS", "region": "Europe", "capital": "Reykjavik", "regime_type": "Parliamentary Republic"},
    {"name": "Ireland", "iso_code": "IE", "region": "Europe", "capital": "Dublin", "regime_type": "Parliamentary Republic"},
    {"name": "Italy", "iso_code": "IT", "region": "Europe", "capital": "Rome", "regime_type": "Parliamentary Republic"},
    {"name": "Kosovo", "iso_code": "XK", "region": "Europe", "capital": "Pristina", "regime_type": "Parliamentary Republic"},
    {"name": "Latvia", "iso_code": "LV", "region": "Europe", "capital": "Riga", "regime_type": "Parliamentary Republic"},
    {"name": "Liechtenstein", "iso_code": "LI", "region": "Europe", "capital": "Vaduz", "regime_type": "Constitutional Monarchy"},
    {"name": "Lithuania", "iso_code": "LT", "region": "Europe", "capital": "Vilnius", "regime_type": "Parliamentary Republic"},
    {"name": "Luxembourg", "iso_code": "LU", "region": "Europe", "capital": "Luxembourg", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Malta", "iso_code": "MT", "region": "Europe", "capital": "Valletta", "regime_type": "Parliamentary Republic"},
    {"name": "Moldova", "iso_code": "MD", "region": "Europe", "capital": "Chișinău", "regime_type": "Parliamentary Republic"},
    {"name": "Monaco", "iso_code": "MC", "region": "Europe", "capital": "Monaco", "regime_type": "Constitutional Monarchy"},
    {"name": "Montenegro", "iso_code": "ME", "region": "Europe", "capital": "Podgorica", "regime_type": "Parliamentary Republic"},
    {"name": "Netherlands", "iso_code": "NL", "region": "Europe", "capital": "Amsterdam", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "North Macedonia", "iso_code": "MK", "region": "Europe", "capital": "Skopje", "regime_type": "Parliamentary Republic"},
    {"name": "Norway", "iso_code": "NO", "region": "Europe", "capital": "Oslo", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Poland", "iso_code": "PL", "region": "Europe", "capital": "Warsaw", "regime_type": "Parliamentary Republic"},
    {"name": "Portugal", "iso_code": "PT", "region": "Europe", "capital": "Lisbon", "regime_type": "Semi-Presidential Republic"},
    {"name": "Romania", "iso_code": "RO", "region": "Europe", "capital": "Bucharest", "regime_type": "Semi-Presidential Republic"},
    {"name": "Russia", "iso_code": "RU", "region": "Europe", "capital": "Moscow", "regime_type": "Semi-Presidential Republic"},
    {"name": "San Marino", "iso_code": "SM", "region": "Europe", "capital": "San Marino", "regime_type": "Parliamentary Republic"},
    {"name": "Serbia", "iso_code": "RS", "region": "Europe", "capital": "Belgrade", "regime_type": "Parliamentary Republic"},
    {"name": "Slovakia", "iso_code": "SK", "region": "Europe", "capital": "Bratislava", "regime_type": "Parliamentary Republic"},
    {"name": "Slovenia", "iso_code": "SI", "region": "Europe", "capital": "Ljubljana", "regime_type": "Parliamentary Republic"},
    {"name": "Spain", "iso_code": "ES", "region": "Europe", "capital": "Madrid", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Sweden", "iso_code": "SE", "region": "Europe", "capital": "Stockholm", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Switzerland", "iso_code": "CH", "region": "Europe", "capital": "Bern", "regime_type": "Federal Republic"},
    {"name": "Ukraine", "iso_code": "UA", "region": "Europe", "capital": "Kyiv", "regime_type": "Semi-Presidential Republic"},
    {"name": "United Kingdom", "iso_code": "GB", "region": "Europe", "capital": "London", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Vatican City", "iso_code": "VA", "region": "Europe", "capital": "Vatican City", "regime_type": "Absolute Monarchy"},
    
    # Americas
    {"name": "Antigua and Barbuda", "iso_code": "AG", "region": "Americas", "capital": "St. John's", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Argentina", "iso_code": "AR", "region": "Americas", "capital": "Buenos Aires", "regime_type": "Presidential Republic"},
    {"name": "Bahamas", "iso_code": "BS", "region": "Americas", "capital": "Nassau", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Barbados", "iso_code": "BB", "region": "Americas", "capital": "Bridgetown", "regime_type": "Parliamentary Republic"},
    {"name": "Belize", "iso_code": "BZ", "region": "Americas", "capital": "Belmopan", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Bolivia", "iso_code": "BO", "region": "Americas", "capital": "Sucre", "regime_type": "Presidential Republic"},
    {"name": "Brazil", "iso_code": "BR", "region": "Americas", "capital": "Brasília", "regime_type": "Presidential Republic"},
    {"name": "Canada", "iso_code": "CA", "region": "Americas", "capital": "Ottawa", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Chile", "iso_code": "CL", "region": "Americas", "capital": "Santiago", "regime_type": "Presidential Republic"},
    {"name": "Colombia", "iso_code": "CO", "region": "Americas", "capital": "Bogotá", "regime_type": "Presidential Republic"},
    {"name": "Costa Rica", "iso_code": "CR", "region": "Americas", "capital": "San José", "regime_type": "Presidential Republic"},
    {"name": "Cuba", "iso_code": "CU", "region": "Americas", "capital": "Havana", "regime_type": "One-Party State"},
    {"name": "Dominica", "iso_code": "DM", "region": "Americas", "capital": "Roseau", "regime_type": "Parliamentary Republic"},
    {"name": "Dominican Republic", "iso_code": "DO", "region": "Americas", "capital": "Santo Domingo", "regime_type": "Presidential Republic"},
    {"name": "Ecuador", "iso_code": "EC", "region": "Americas", "capital": "Quito", "regime_type": "Presidential Republic"},
    {"name": "El Salvador", "iso_code": "SV", "region": "Americas", "capital": "San Salvador", "regime_type": "Presidential Republic"},
    {"name": "Grenada", "iso_code": "GD", "region": "Americas", "capital": "St. George's", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Guatemala", "iso_code": "GT", "region": "Americas", "capital": "Guatemala City", "regime_type": "Presidential Republic"},
    {"name": "Guyana", "iso_code": "GY", "region": "Americas", "capital": "Georgetown", "regime_type": "Parliamentary Republic"},
    {"name": "Haiti", "iso_code": "HT", "region": "Americas", "capital": "Port-au-Prince", "regime_type": "Semi-Presidential Republic"},
    {"name": "Honduras", "iso_code": "HN", "region": "Americas", "capital": "Tegucigalpa", "regime_type": "Presidential Republic"},
    {"name": "Jamaica", "iso_code": "JM", "region": "Americas", "capital": "Kingston", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Mexico", "iso_code": "MX", "region": "Americas", "capital": "Mexico City", "regime_type": "Presidential Republic"},
    {"name": "Nicaragua", "iso_code": "NI", "region": "Americas", "capital": "Managua", "regime_type": "Presidential Republic"},
    {"name": "Panama", "iso_code": "PA", "region": "Americas", "capital": "Panama City", "regime_type": "Presidential Republic"},
    {"name": "Paraguay", "iso_code": "PY", "region": "Americas", "capital": "Asunción", "regime_type": "Presidential Republic"},
    {"name": "Peru", "iso_code": "PE", "region": "Americas", "capital": "Lima", "regime_type": "Presidential Republic"},
    {"name": "Saint Kitts and Nevis", "iso_code": "KN", "region": "Americas", "capital": "Basseterre", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Saint Lucia", "iso_code": "LC", "region": "Americas", "capital": "Castries", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Saint Vincent and the Grenadines", "iso_code": "VC", "region": "Americas", "capital": "Kingstown", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Suriname", "iso_code": "SR", "region": "Americas", "capital": "Paramaribo", "regime_type": "Presidential Republic"},
    {"name": "Trinidad and Tobago", "iso_code": "TT", "region": "Americas", "capital": "Port of Spain", "regime_type": "Parliamentary Republic"},
    {"name": "United States", "iso_code": "US", "region": "Americas", "capital": "Washington, D.C.", "regime_type": "Presidential Republic"},
    {"name": "Uruguay", "iso_code": "UY", "region": "Americas", "capital": "Montevideo", "regime_type": "Presidential Republic"},
    {"name": "Venezuela", "iso_code": "VE", "region": "Americas", "capital": "Caracas", "regime_type": "Presidential Republic"},
    
    # Oceania
    {"name": "Australia", "iso_code": "AU", "region": "Oceania", "capital": "Canberra", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Fiji", "iso_code": "FJ", "region": "Oceania", "capital": "Suva", "regime_type": "Parliamentary Republic"},
    {"name": "Kiribati", "iso_code": "KI", "region": "Oceania", "capital": "Tarawa", "regime_type": "Presidential Republic"},
    {"name": "Marshall Islands", "iso_code": "MH", "region": "Oceania", "capital": "Majuro", "regime_type": "Parliamentary Republic"},
    {"name": "Micronesia", "iso_code": "FM", "region": "Oceania", "capital": "Palikir", "regime_type": "Federal Republic"},
    {"name": "Nauru", "iso_code": "NR", "region": "Oceania", "capital": "Yaren", "regime_type": "Parliamentary Republic"},
    {"name": "New Zealand", "iso_code": "NZ", "region": "Oceania", "capital": "Wellington", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Palau", "iso_code": "PW", "region": "Oceania", "capital": "Ngerulmud", "regime_type": "Presidential Republic"},
    {"name": "Papua New Guinea", "iso_code": "PG", "region": "Oceania", "capital": "Port Moresby", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Samoa", "iso_code": "WS", "region": "Oceania", "capital": "Apia", "regime_type": "Parliamentary Republic"},
    {"name": "Solomon Islands", "iso_code": "SB", "region": "Oceania", "capital": "Honiara", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Tonga", "iso_code": "TO", "region": "Oceania", "capital": "Nuku'alofa", "regime_type": "Constitutional Monarchy"},
    {"name": "Tuvalu", "iso_code": "TV", "region": "Oceania", "capital": "Funafuti", "regime_type": "Parliamentary Constitutional Monarchy"},
    {"name": "Vanuatu", "iso_code": "VU", "region": "Oceania", "capital": "Port Vila", "regime_type": "Parliamentary Republic"},
]

def generate_risk_scores(country_name: str, region: str, regime_type: str) -> dict:
    """Generate reasonable risk scores based on regime type and region"""
    
    # Base risk by regime type
    regime_risk = {
        "Military Junta": 75,
        "One-Party State": 65,
        "Absolute Monarchy": 55,
        "Theocratic Republic": 60,
        "Transitional Government": 80,
        "Islamic Emirate": 85,
        "Presidential Republic": 35,
        "Parliamentary Republic": 25,
        "Semi-Presidential Republic": 30,
        "Constitutional Monarchy": 20,
        "Parliamentary Constitutional Monarchy": 18,
        "Federal Republic": 25,
        "Federal Absolute Monarchy": 45,
        "Parliamentary Co-Principality": 15,
    }
    
    base_risk = regime_risk.get(regime_type, 40)
    
    # Regional modifiers
    region_modifier = {
        "Africa": 15,
        "Asia": 10,
        "Europe": -10,
        "Americas": 5,
        "Oceania": -5,
    }
    
    modifier = region_modifier.get(region, 0)
    
    # Calculate scores with some randomness
    import random
    overall = max(5, min(95, base_risk + modifier + random.randint(-10, 10)))
    political = max(5, min(95, overall + random.randint(-15, 15)))
    economic = max(5, min(95, overall + random.randint(-15, 15)))
    security = max(5, min(95, overall + random.randint(-15, 15)))
    
    # Determine risk level
    if overall >= 70:
        risk_level = "Critical"
    elif overall >= 50:
        risk_level = "High"
    elif overall >= 30:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
    
    # Determine trend
    trends = ["Improving", "Stable", "Stable", "Deteriorating"]  # Stable is more common
    risk_trend = random.choice(trends)
    
    return {
        "overall_risk_score": overall,
        "political_risk_score": political,
        "economic_risk_score": economic,
        "security_risk_score": security,
        "risk_level": risk_level,
        "risk_trend": risk_trend,
    }

def seed_countries():
    """Seed all countries with upsert to avoid duplicates"""
    print(f"Starting to seed {len(COUNTRIES)} countries...")
    
    for idx, country in enumerate(COUNTRIES, 1):
        risk_data = generate_risk_scores(
            country["name"], 
            country["region"], 
            country["regime_type"]
        )
        
        country_data = {
            **country,
            **risk_data,
            "last_updated": datetime.now().isoformat(),
        }
        
        try:
            # Upsert to avoid duplicates
            result = supabase.table("countries").upsert(
                country_data,
                on_conflict="iso_code"
            ).execute()
            
            print(f"[{idx}/{len(COUNTRIES)}] ✓ {country['name']} ({country['iso_code']})")
            
        except Exception as e:
            print(f"[{idx}/{len(COUNTRIES)}] ✗ {country['name']}: {e}")
    
    print(f"\nSeeding complete! {len(COUNTRIES)} countries processed.")

if __name__ == "__main__":
    seed_countries()
