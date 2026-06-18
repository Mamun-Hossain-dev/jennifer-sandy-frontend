export interface Apartment {
  id: number
  title: string
  price: number
  size: number
  rooms: number
  hasBalcony: boolean
  availableFrom: string
  image: string
  images: string[]
  district: string
  lat: number
  lng: number
  amenities: string[]
  description: string
  deposit: number
  minimumStay: number
  serviceFee: string
  locationSubtitle: string
  locationDescription: string
  locationDetails: {
    subway: string
    restaurants: string
    rhine: string
  }
}

export const dummyApartments: Apartment[] = [
  {
    id: 1,
    title: 'Skyline Luxury Apartments',
    price: 1800,
    size: 75,
    rooms: 3,
    hasBalcony: true,
    availableFrom: '01.05.2026',
    image: '/images/properties-2.jpg',
    images: [
      '/images/properties-2.jpg',
      '/images/properties-1.jpg',
      '/images/properties-3.jpg',
      '/images/properties-4.jpg',
    ],
    district: 'Media Harbour',
    lat: 51.2185,
    lng: 6.7589,
    amenities: [
      'Furnished',
      'Transportation & parking',
      'Wi-Fi',
      'Elevator',
      'Fitted kitchen',
      'Emergency Alert System',
      'Move-in coordination',
      'Meal preparation and service',
      'Pet-friendly',
      'Balcony',
    ],
    description: `Welcome to this stunning Skyline Luxury Apartments apartment in the heart of Harbour, one of Düsseldorf's most desirable neighborhoods. This beautifully furnished 3-room apartment offers 75 square meters of comfortable living space with high ceilings and abundant natural light.

The apartment features a spacious living area with a modern kitchen, a separate bedroom, and a stylish bathroom. The large windows provide plenty of light throughout the day, creating a bright and welcoming atmosphere.

Located in a quiet residential area, you'll enjoy excellent public transport connections and easy access to shops, restaurants, and cultural attractions. Perfect for professionals or couples looking for a comfortable temporary home in Düsseldorf.`,
    deposit: 1450,
    minimumStay: 3,
    serviceFee: 'None',
    locationSubtitle: "The heart of Düsseldorf's creative scene",
    locationDescription:
      "Enjoy the dynamic atmosphere of Düsseldorf's Media Harbour. Surrounded by modern architecture, first-class restaurants, and creative hotspots, this location offers an unparalleled quality of life in the heart of the action.",
    locationDetails: {
      subway: '5 min',
      restaurants: '2 min',
      rhine: '3.14 min',
    },
  },
  {
    id: 2,
    title: 'Modern Oberkassel Studio',
    price: 1200,
    size: 45,
    rooms: 1,
    hasBalcony: false,
    availableFrom: '15.06.2026',
    image: '/images/properties-1.jpg',
    images: [
      '/images/properties-1.jpg',
      '/images/properties-2.jpg',
      '/images/properties-3.jpg',
      '/images/properties-4.jpg',
    ],
    district: 'Oberkassel',
    lat: 51.2312,
    lng: 6.7501,
    amenities: ['Fitted kitchen', 'Furnished', 'Wi-Fi', 'Pet-friendly', 'Transportation & parking'],
    description: `This modern Oberkassel Studio offers a cozy and stylish home in one of Düsseldorf's premium districts. Fully furnished with high-quality amenities, it is perfect for single professionals seeking comfort and proximity to the city center.

Featuring a bright open-plan layout, a fully equipped modern kitchen, and high-speed Wi-Fi, this apartment ensures a seamless move-in experience. Excellent transport connections are just steps away.`,
    deposit: 1000,
    minimumStay: 2,
    serviceFee: 'None',
    locationSubtitle: 'Premium living west of the Rhine',
    locationDescription:
      'Oberkassel is renowned for its elegant Art Nouveau buildings, upscale boutiques, and relaxed atmosphere. Highly popular among professionals who appreciate quality living.',
    locationDetails: {
      subway: '3 min',
      restaurants: '4 min',
      rhine: '5 min',
    },
  },
  {
    id: 3,
    title: 'Carlstadt Premium Suite',
    price: 2400,
    size: 95,
    rooms: 4,
    hasBalcony: true,
    availableFrom: '01.07.2026',
    image: '/images/properties-3.jpg',
    images: [
      '/images/properties-3.jpg',
      '/images/properties-2.jpg',
      '/images/properties-1.jpg',
      '/images/properties-4.jpg',
    ],
    district: 'Carlstadt',
    lat: 51.2215,
    lng: 6.7725,
    amenities: [
      'Balcony/Terrace',
      'Fitted kitchen',
      'Furnished',
      'Elevator',
      'Concierge',
      'Wi-Fi',
      'Move-in coordination',
    ],
    description: `Experience luxury living at its finest in this Carlstadt Premium Suite. Boasting 95 square meters, 4 spacious rooms, and high-end furnishings, this apartment is ideal for families or executives who desire the ultimate comfort.

Includes a large living room, fully fitted premium kitchen, elevator access, and a concierge service. Located near the historic Carlsplatz market.`,
    deposit: 2000,
    minimumStay: 6,
    serviceFee: 'None',
    locationSubtitle: 'Historic charm meets modern luxury',
    locationDescription:
      'Carlstadt offers a unique blend of historical charm, cultural galleries, and modern boutiques. Quiet yet centrally located, it is one of the most sought-after neighborhoods in Düsseldorf.',
    locationDetails: {
      subway: '4 min',
      restaurants: '1 min',
      rhine: '2 min',
    },
  },
  {
    id: 4,
    title: 'Media Harbour Penthouse',
    price: 2900,
    size: 110,
    rooms: 4,
    hasBalcony: true,
    availableFrom: '01.05.2026',
    image: '/images/properties-4.jpg',
    images: [
      '/images/properties-4.jpg',
      '/images/properties-1.jpg',
      '/images/properties-2.jpg',
      '/images/properties-3.jpg',
    ],
    district: 'Media Harbour',
    lat: 51.2162,
    lng: 6.7562,
    amenities: [
      'Balcony/Terrace',
      'Fitted kitchen',
      'Furnished',
      'Elevator',
      'Concierge',
      'Transportation & parking',
      'Wi-Fi',
      'Emergency Alert System',
      'Move-in coordination',
    ],
    description: `Perched high above Düsseldorf's Media Harbour, this premium penthouse offers breathtaking panoramic views of the Rhine. Featuring 110 square meters of beautifully designed space, this home is perfect for those who enjoy the finer things in life.

Includes concierge service, secure parking, a private wrap-around terrace, and state-of-the-art home automation.`,
    deposit: 2500,
    minimumStay: 6,
    serviceFee: 'None',
    locationSubtitle: 'Iconic architecture and waterfront views',
    locationDescription:
      "Media Harbour is the architectural showcase of Düsseldorf. Live among award-winning designs by Frank Gehry and enjoy world-class restaurants right at your doorstep.",
    locationDetails: {
      subway: '6 min',
      restaurants: '3 min',
      rhine: '1 min',
    },
  },
  {
    id: 5,
    title: 'Düsseldorf Center Loft',
    price: 1550,
    size: 68,
    rooms: 2,
    hasBalcony: true,
    availableFrom: '01.08.2026',
    image: '/images/properties-2.jpg',
    images: [
      '/images/properties-2.jpg',
      '/images/properties-1.jpg',
      '/images/properties-3.jpg',
      '/images/properties-4.jpg',
    ],
    district: 'Carlstadt',
    lat: 51.2238,
    lng: 6.7801,
    amenities: ['Balcony/Terrace', 'Fitted kitchen', 'Furnished', 'Wi-Fi', 'Pet-friendly', 'Elevator'],
    description: `A stunning industrial-style loft in the center of Düsseldorf. This apartment features high ceilings, open brickwork, and modern premium furniture. The perfect base for exploring everything Düsseldorf has to offer.`,
    deposit: 1200,
    minimumStay: 3,
    serviceFee: 'None',
    locationSubtitle: 'Central, vibrant, and connected',
    locationDescription:
      'Located steps away from shopping streets, dining options, and prime public transportation links. Live at the center of the action.',
    locationDetails: {
      subway: '2 min',
      restaurants: '2 min',
      rhine: '8 min',
    },
  },
  {
    id: 6,
    title: 'Cozy Oberkassel Flat',
    price: 1400,
    size: 60,
    rooms: 2,
    hasBalcony: true,
    availableFrom: '01.06.2026',
    image: '/images/properties-3.jpg',
    images: [
      '/images/properties-3.jpg',
      '/images/properties-2.jpg',
      '/images/properties-1.jpg',
      '/images/properties-4.jpg',
    ],
    district: 'Oberkassel',
    lat: 51.2285,
    lng: 6.7452,
    amenities: [
      'Balcony/Terrace',
      'Fitted kitchen',
      'Furnished',
      'Wi-Fi',
      'Elevator',
      'Emergency Alert System',
    ],
    description: `A lovely and cozy 2-room flat in the heart of Oberkassel. This apartment offers a quiet, relaxed atmosphere with a charming balcony looking over green courtyards. Fully furnished and ready to move in.`,
    deposit: 1100,
    minimumStay: 3,
    serviceFee: 'None',
    locationSubtitle: 'Quiet elegance near the Rhine meadows',
    locationDescription:
      'Oberkassel offers high-end living in a calm, historic neighborhood. Enjoy morning walks along the Rhine meadows and dining in local cafes.',
    locationDetails: {
      subway: '4 min',
      restaurants: '3 min',
      rhine: '4 min',
    },
  },
]
