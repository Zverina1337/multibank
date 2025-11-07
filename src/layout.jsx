import { SessionProvider } from './SessionProvider'
import './globals.css'

export const metadata = {
  title: 'MultiBank',
  description: 'MultiBank Authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}