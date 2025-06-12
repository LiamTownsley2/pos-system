module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
    './src/renderer/src/**/*.{html,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: '#4F46E5',
        fertilisers: '#9E9D24',
        soil: '#5C4033',
        plantcare: '#4CAF50',
        canes: '#8B5E3C',
        seeds: '#D4A373',
        fuel: '#C62828'
      },
      spacing: {
        128: '32rem'
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('flowbite/plugin')]
}
