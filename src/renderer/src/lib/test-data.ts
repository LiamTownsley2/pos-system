enum Categories {
  Fertilisers = 0,
  SoilAndCompost = 1,
  PlantCare = 2,
  CanesAndSupports = 3,
  SeedsAndSets = 4,
  Fuel = 5
}

export type Category = {
  id: number
  name: string
  image: string
  colour: string
}

export const CategoryData = [
  {
    id: 0,
    name: 'Fertilisers',
    image: 'https://cdn-icons-png.flaticon.com/512/5264/5264906.png',
    colour: '#9E9D24'
  },
  {
    id: 1,
    name: 'Soil and Compost',
    image:
      'https://static.vecteezy.com/system/resources/previews/007/351/300/non_2x/bag-of-soil-symbol-of-development-organic-agriculture-natural-products-the-concept-of-recycling-vector.jpg',
    colour: '#5C4033'
  },
  {
    id: 2,
    name: 'Plant Care',
    image:
      'https://static.vecteezy.com/system/resources/previews/007/983/381/non_2x/happy-plant-lady-young-woman-plant-lover-taking-care-of-houseplant-girl-with-potted-plant-flat-illustration-on-white-background-vector.jpg',
    colour: '#4CAF50'
  },
  {
    id: 3,
    name: 'Canes and Supports',
    image:
      'https://media.istockphoto.com/id/1176817248/vector/wooden-walking-stick.jpg?s=612x612&w=0&k=20&c=hTu8fyAU6O_jLaOVZ5WuCIgNY_NyLU02ZeQrrzva_bA=',
    colour: '#8B5E3C'
  },
  {
    id: 4,
    name: 'Seeds and Sets',
    image: 'https://spaces-cdn.clipsafari.com/46ayc70lwrovgy9vzs4wxtybc48z',
    colour: '#D4A373'
  },
  {
    id: 5,
    name: 'Fuel',
    image:
      'https://media.istockphoto.com/id/983207866/vector/red-canister-isolated-on-white-background-vector-illustration-in-flat-style-eps10.jpg?s=612x612&w=0&k=20&c=NnV0I9rIuOztDzbSwT5vBzxEF7rQqqneTAraVq1TEXw=',
    colour: '#C62828'
  }
]

export type Product = {
  name: string
  unit: string
  price_per_unit: number
  category: Categories
}
export const ProductData: Product[] = [
  {
    name: 'Potato Fertiliser',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Growmore',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Hoof & Horn',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Bone Meal',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Fish / Blood Bone',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Sulpher Potash',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Sulpher Amonia',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Sulpher Phosphate',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Dried Blood',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.Fertilisers
  },
  {
    name: 'Lime',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: Categories.SoilAndCompost
  },
  {
    name: 'Mustard Seed',
    unit: 'lbs',
    price_per_unit: 1.7,
    category: Categories.SeedsAndSets
  },
  {
    name: 'Compost',
    unit: '60 ltr',
    price_per_unit: 7.0,
    category: Categories.SoilAndCompost
  },
  {
    name: 'Growbags',
    unit: 'bag',
    price_per_unit: 3.0,
    category: Categories.SoilAndCompost
  },
  {
    name: 'Growbags X6',
    unit: 'bag',
    price_per_unit: 10.0,
    category: Categories.SoilAndCompost
  },
  {
    name: 'Slug Pellets',
    unit: 'pkt',
    price_per_unit: 2.5,
    category: Categories.PlantCare
  },
  {
    name: 'Tomato Food',
    unit: 'pkt',
    price_per_unit: 2.5,
    category: Categories.PlantCare
  },
  {
    name: 'Fleece',
    unit: 'mtr',
    price_per_unit: 0.6,
    category: Categories.PlantCare
  },
  {
    name: "8' Cane",
    unit: 'each',
    price_per_unit: 0.7,
    category: Categories.CanesAndSupports
  },
  {
    name: "6' Cane",
    unit: 'each',
    price_per_unit: 0.45,
    category: Categories.CanesAndSupports
  },
  {
    name: "4' Cane",
    unit: 'each',
    price_per_unit: 0.35,
    category: Categories.CanesAndSupports
  },
  {
    name: 'Seed Pots',
    unit: 'lbs',
    price_per_unit: 0.7,
    category: Categories.SeedsAndSets
  },
  {
    name: 'Onion Sets',
    unit: '½ lb',
    price_per_unit: 1.0,
    category: Categories.SeedsAndSets
  },
  {
    name: 'Paraffin Garden',
    unit: '4 ltr',
    price_per_unit: 3.5,
    category: Categories.Fuel
  },
  {
    name: 'Paraffin Outside',
    unit: '4 ltr',
    price_per_unit: 4.5,
    category: Categories.Fuel
  }
]
