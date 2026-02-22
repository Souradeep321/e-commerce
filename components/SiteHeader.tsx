'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { SearchOverlay } from '@/components/search-overlay'
import { MobileMenu } from '@/components/MobileMenu'

const navLinks = [
  { label: 'New Arrivals', href: '/#new-arrivals' },
  { label: 'Women', href: '/#categories' },
  { label: 'Men', href: '/#categories' },
  { label: 'Kids', href: '/#categories' },
  { label: 'Accessories', href: '/#categories' },
]

const SiteHeader =()=> {
//   const { totalItems, setIsCartOpen } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 lg:px-6">
          {/* Left: Mobile menu + Navigation */}
          <div className="flex items-center gap-2 lg:gap-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 transition-colors hover:bg-secondary lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center">
              <span className="font-serif text-xl font-bold tracking-tight sm:text-2xl">
                AURVA
              </span>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 transition-colors hover:bg-secondary"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            {/* <button
              className="hidden rounded-lg p-2 transition-colors hover:bg-secondary sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button> */}
            <button
              className="hidden rounded-lg p-2 transition-colors hover:bg-secondary sm:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>
            <button
            //   onClick={() => setIsCartOpen(true)}
              className="relative rounded-lg p-2 transition-colors hover:bg-secondary"
            //   aria-label={`Shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {/* {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {totalItems}
                </span>
              )} */}
            </button>
          </div>
        </div>
      </header>

      {/* <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} /> */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}

export default SiteHeader