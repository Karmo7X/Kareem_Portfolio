import { Inter, JetBrains_Mono, Syne } from 'next/font/google';

// Display / body / telemetry — the three voices of the Atelier Digital system.
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const latinFontVars = `${syne.variable} ${inter.variable} ${jetbrains.variable}`;
