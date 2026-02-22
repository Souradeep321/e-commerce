'use client'

import Link from 'next/link'
import { X, ChevronRight, Heart, User, Package, HelpCircle } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

const menuSections = [
    {
        title: 'Shop',
        links: [
            { label: 'New Arrivals', href: '/#new-arrivals' },
            { label: 'Women', href: '/#categories' },
            { label: 'Men', href: '/#categories' },
            { label: 'Kids', href: '/#categories' },
            { label: 'Accessories', href: '/#categories' },
            { label: 'Sale', href: '/#trending' },
        ],
    },
]

const accountLinks = [
    { icon: User, label: 'My Account', href: '#' },
    { icon: Package, label: 'Orders', href: '#' },
    //   { icon: Heart, label: 'Wishlist', href: '#' },
    { icon: HelpCircle, label: 'Help Center', href: '#' },
]

interface MobileMenuProps {
    open: boolean
    onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-full max-w-sm overflow-y-auto p-0 sm:w-80">
                <SheetHeader className="border-b border-border px-5 py-4">
                    <SheetTitle className="font-serif text-xl tracking-tight">
                        AURVA
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col">
                    {menuSections.map((section) => (
                        <div key={section.title} className="border-b border-border py-2">
                            <p className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {section.title}
                            </p>
                            {section.links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={onClose}
                                    className="flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                                >
                                    {link.label}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            ))}
                        </div>
                    ))}

                    <div className="py-2">
                        <p className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Account
                        </p>
                        {accountLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                            >
                                <link.icon className="h-4 w-4 text-muted-foreground" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
