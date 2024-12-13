
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@mantine/core/styles.css';
import { Provider } from "./provider";
import { ColorSchemeScript } from "@mantine/core";
import {NextIntlClientProvider} from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rpgtracker"
};

  const locale = await getLocale();
 
  const messages = await getMessages();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark"/>
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} formats={{
          dateTime: {
            long: {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }
          }
        }}>
          <Provider>
            {children}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
