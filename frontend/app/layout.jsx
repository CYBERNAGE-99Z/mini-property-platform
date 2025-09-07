import '../styles/globals.css';
import '../styles/components.css';
import Header from '../components/Header';

export const metadata = { title: 'Mini Property Platform' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ padding: '1rem 2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
