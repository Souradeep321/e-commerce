"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const footerLinks = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '#' },
      { label: 'Women', href: '#' },
      { label: 'Men', href: '#' },
      { label: 'Kids', href: '#' },
      { label: 'Accessories', href: '#' },
      { label: 'Sale', href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track Order', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Size Guide', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About AURVA', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Sustainability', href: '#' },
    ],
  },
]

const SiteFooter: React.FC = () => {
    const pathname = usePathname();

  // Don't render the footer on the checkout page
  const excludedPaths = [
    // '/checkout',
    '/cart',
    '/account',
    '/account/orders',
    '/account/wishlist',
    '/account/settings',
    '/account/profile',
    '/account/addresses',
    '/account/questions',
    '/account/reviews',
    '/account/returns',
    '/account/track-order',
    '/admin',
  ];

  if (excludedPaths.some(path => pathname.startsWith(path))) {
    return null;
  }
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Newsletter */}
        {/* <div className="flex flex-col items-center gap-4 border-b border-border py-10 text-center sm:py-12">
          <h3 className="font-serif text-xl font-bold sm:text-2xl">
            Stay in the loop
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Subscribe for early access to new collections, exclusive offers, and
            style tips.
          </p>
          <div className="flex w-full max-w-sm items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
            <button className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Subscribe
            </button>
          </div>
        </div> */}

        {/* Links */}
        <div className="grid grid-cols-2 gap-8 py-10 sm:py-12 lg:grid-cols-4 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight">
              AURVA
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curated fashion for the modern Indian wardrobe. Premium quality,
              timeless style.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold">{section.title}</h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {'© 2026 AURVA. All rights reserved.'}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter;