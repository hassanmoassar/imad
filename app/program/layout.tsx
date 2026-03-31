import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Program Details - Morocco Voyages',
  description: 'Explore detailed program information and booking options',
}

export default function ProgramDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
