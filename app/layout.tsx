import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sora, Source_Sans_3 } from 'next/font/google';
import { getSiteData } from '@/lib/content';
import { JsonLd } from '@/components/json-ld';
import { SiteNav } from '@/components/site-nav';
import { contactContent, getPrimaryNavigation } from '@/lib/site-content';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800']
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.atasal.org'),
  title: {
    default: 'ATASAL',
    template: '%s | ATASAL'
  },
  description: 'Asociación de Técnicos Azucareros de El Salvador',
  openGraph: {
    type: 'website',
    locale: 'es_SV',
    title: 'ATASAL',
    description: 'Asociación de Técnicos Azucareros de El Salvador',
    siteName: 'ATASAL'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATASAL',
    description: 'Asociación de Técnicos Azucareros de El Salvador'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = getSiteData();
  const menu = getPrimaryNavigation();
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ATASAL',
    url: 'https://www.atasal.org',
    description: data.site.description
  };
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ATASAL',
    url: 'https://www.atasal.org',
    inLanguage: 'es-SV'
  };

  return (
    <html lang="es" className={`${sora.variable} ${sourceSans.variable}`}>
      <body>
        <JsonLd data={orgSchema} />
        <JsonLd data={webSiteSchema} />
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header-inner header-main">
              <Link className="brand-group" href="/">
                <img
                  src="/legacy/wp-content/uploads/2022/01/atasal-logo.png"
                  alt="ATASAL"
                  width={88}
                  height={54}
                />
              </Link>
              <div className="header-actions">
                <SiteNav items={menu} />
              </div>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="site-footer-inner">
              <div className="footer-grid">
                <div>
                  <p className="footer-brand">
                    <img
                      src="/legacy/wp-content/uploads/2022/01/atasal-logo.png"
                      alt="ATASAL"
                      width={34}
                      height={20}
                    />
                    <strong>ATASAL</strong>
                  </p>
                  <p>Asociación de Técnicos Azucareros de El Salvador</p>
                </div>
                <div>
                  <p>{contactContent.phone}</p>
                  <p>
                    <a href={`mailto:${contactContent.email}`}>{contactContent.email}</a>
                  </p>
                </div>
                <div>
                  <p>{contactContent.office[1]}</p>
                  <p>{contactContent.office[2]}</p>
                </div>
                <div>
                  <p>
                    <a href={contactContent.facebookUrl} target="_blank" rel="noopener noreferrer">
                      Facebook oficial
                    </a>
                  </p>
                  <p>© {new Date().getFullYear()} ATASAL</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
