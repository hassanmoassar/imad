export type ServiceType = 'transfers' | 'excursions' | 'tour-circuits'

export type Program = {
  id: string
  title: string
  service: ServiceType
  duration?: string
  price?: string
  summary?: string
}

export const programs: Program[] = [
  {
    id: 'p1',
    title: 'Airport Transfer Casablanca - Rabat',
    service: 'transfers',
    duration: '1h 10m',
    price: '€45',
    summary: 'Private airport transfer between Casablanca and Rabat with meet & greet.'
  },
  {
    id: 'p2',
    title: 'Marrakech City Transfer (Airport)',
    service: 'transfers',
    duration: '45m',
    price: '€35',
    summary: 'Comfort transfer from Marrakech-Menara airport to your riad.'
  },
  {
    id: 'p3',
    title: 'Essaouira Day Excursion from Marrakech',
    service: 'excursions',
    duration: '12h',
    price: '€70',
    summary: 'Full-day excursion to Essaouira with guided walk and seafood lunch.'
  },
  {
    id: 'p4',
    title: 'Ouzoud Waterfalls Excursion',
    service: 'excursions',
    duration: '10h',
    price: '€60',
    summary: 'Guided day trip to the Ouzoud waterfalls including boat ride.'
  },
  {
    id: 'p5',
    title: '7-Day Imperial Cities Circuit',
    service: 'tour-circuits',
    duration: '7 days',
    price: '€890',
    summary: 'Explore Rabat, Meknes, Fes and Marrakech with expert guide and transfers.'
  },
  {
    id: 'p6',
    title: '10-Day Desert & Atlas Circuit',
    service: 'tour-circuits',
    duration: '10 days',
    price: '€1290',
    summary: 'Sahara camel trek, Erg Chebbi dunes and Atlas mountain villages.'
  }
]
