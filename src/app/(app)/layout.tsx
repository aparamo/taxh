import clsx from 'clsx';
import {Inter} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import Header from '@/components/layout/Header';
import './globals.css';
import Footer from '@/components/layout/Footer';

const inter = Inter({subsets: ['latin']});

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({children}: Props) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <title>starter</title>
      </head>
      <body
        className={clsx(
          'flex min-h-[100vh] flex-col bg-slate-100',
          inter.className
        )}
      >
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
