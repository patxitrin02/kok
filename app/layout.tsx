import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'El Túnel del Tiempo: Tu Profesor de Historia',
  description: 'Un chatbot interactivo y educativo impulsado por IA para explorar la historia.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-slate-100 bg-slate-900 selection:bg-indigo-500/30 min-h-screen">
        {children}
      </body>
    </html>
  );
}
