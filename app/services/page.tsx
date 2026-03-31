import Link from 'next/link'
import type { Metadata } from 'next'
import { CarIcon, DesertIcon, PalaceIcon } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'Our Services - Morocco Voyages',
  description: 'Transfers, Excursions and Tour Circuits',
}

const services = [
  {
    id: 'transfers',
    label: 'Premium Transfers',
    description: 'Private and shared transfers between airports and cities with professional drivers.',
    icon: <CarIcon />,
    color: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    hoverBorderColor: 'hover:border-amber-300',
  },
  {
    id: 'excursions',
    label: 'Desert Excursions',
    description: 'Day trips and guided excursions to top attractions with expert guides.',
    icon: <DesertIcon />,
    color: 'from-rose-50 to-red-50',
    accentColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    hoverBorderColor: 'hover:border-rose-300',
  },
  {
    id: 'tour-circuits',
    label: 'Cultural Tours',
    description: 'Multi-day circuits and curated tours across Morocco exploring rich heritage.',
    icon: <PalaceIcon />,
    color: 'from-blue-50 to-cyan-50',
    accentColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    hoverBorderColor: 'hover:border-blue-300',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold uppercase tracking-wide">
              ✨ Explore
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of travel services designed to make your Moroccan journey unforgettable
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`} className="block h-full group">
              <div
                className={`h-full p-8 lg:p-10 bg-gradient-to-br ${service.color} rounded-2xl border ${service.borderColor} ${service.hoverBorderColor} transition-all duration-300 overflow-hidden hover:shadow-xl`}
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-current to-transparent blur-2xl" />
                </div>

                {/* Icon with background */}
                <div className={`w-16 h-16 mb-6 ${service.accentColor} relative z-10 group-hover:scale-110 group-hover:rotate-5 transition-transform duration-300`}>
                  <div className="absolute inset-0 opacity-20 rounded-full blur-lg" />
                  {service.icon}
                </div>

                {/* Content */}
                <h2 className="text-2xl lg:text-2xl font-bold text-neutral-900 mb-4 relative z-10">
                  {service.label}
                </h2>
                <p className="text-neutral-700 leading-relaxed mb-6 relative z-10 text-base">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <div className={`inline-flex items-center ${service.accentColor} font-semibold relative z-10 group/link transition-transform duration-300 group-hover:translate-x-1`}>
                  <span className="relative">
                    Explore Service
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 ${service.accentColor} opacity-60 w-0 group-hover/link:w-full transition-all duration-300`}
                    />
                  </span>
                  <svg
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/link:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Morocco?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Choose a service above to learn more details and book your perfect Moroccan adventure
          </p>
          <Link href="/#contact">
            <button className="px-8 py-3 bg-white text-amber-700 font-bold rounded-xl hover:shadow-lg transition-shadow duration-300">
              Get In Touch
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
