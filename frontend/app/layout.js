import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Jain Sahab Special - Premium Indian Pickles & Achaar',
  description: 'Authentic Indian pickles and achaar masala made with traditional recipes. Shop mango pickle, lemon pickle, amla pickle and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
