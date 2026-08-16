import './globals.css'

export const metadata = {
  title: 'Arkiva GED',
  description: 'GED Nouvelle Génération',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
