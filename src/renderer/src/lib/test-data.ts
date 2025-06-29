import { Product } from '../../../types/product'
// export const CategoryData = [
//   {
//     id: 0,
//     name: 'Fertilisers',
//     colour: '#9E9D24'
//   },
//   {
//     id: 1,
//     name: 'Soil and Compost',
//     colour: '#5C4033'
//   },
//   {
//     id: 2,
//     name: 'Plant Care',
//     colour: '#4CAF50'
//   },
//   {
//     id: 3,
//     name: 'Canes and Supports',
//     colour: '#8B5E3C'
//   },
//   {
//     id: 4,
//     name: 'Seeds and Sets',
//     colour: '#D4A373'
//   },
//   {
//     id: 5,
//     name: 'Fuel',
//     colour: '#C62828'
//   }
// ]

export const ProductData: Omit<Product, 'id'>[] = [
  {
    name: 'Potato Fertiliser',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Growmore',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Hoof & Horn',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Bone Meal',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Fish / Blood Bone',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Sulpher Potash',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Sulpher Amonia',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Sulpher Phosphate',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Dried Blood',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 0
  },
  {
    name: 'Lime',
    unit: 'lbs',
    price_per_unit: 0.6,
    category: 1
  },
  {
    name: 'Mustard Seed',
    unit: 'lbs',
    price_per_unit: 1.7,
    category: 4
  },
  {
    name: 'Compost',
    unit: '60 ltr',
    price_per_unit: 7.0,
    category: 1
  },
  {
    name: 'Growbags',
    unit: 'bag',
    price_per_unit: 3.0,
    category: 1
  },
  {
    name: 'Growbags X6',
    unit: 'bag',
    price_per_unit: 10.0,
    category: 1
  },
  {
    name: 'Slug Pellets',
    unit: 'pkt',
    price_per_unit: 2.5,
    category: 2
  },
  {
    name: 'Tomato Food',
    unit: 'pkt',
    price_per_unit: 2.5,
    category: 2
  },
  {
    name: 'Fleece',
    unit: 'mtr',
    price_per_unit: 0.6,
    category: 2
  },
  {
    name: "8' Cane",
    unit: 'each',
    price_per_unit: 0.7,
    category: 3
  },
  {
    name: "6' Cane",
    unit: 'each',
    price_per_unit: 0.45,
    category: 3
  },
  {
    name: "4' Cane",
    unit: 'each',
    price_per_unit: 0.35,
    category: 3
  },
  {
    name: 'Seed Pots',
    unit: 'lbs',
    price_per_unit: 0.7,
    category: 4
  },
  {
    name: 'Onion Sets',
    unit: '½ lb',
    price_per_unit: 1.0,
    category: 4
  },
  {
    name: 'Paraffin Garden',
    unit: '4 ltr',
    price_per_unit: 3.5,
    category: 5
  },
  {
    name: 'Paraffin Outside',
    unit: '4 ltr',
    price_per_unit: 4.5,
    category: 5
  }
]
