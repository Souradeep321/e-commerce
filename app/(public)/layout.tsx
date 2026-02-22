import AnnouncementBar from "@/components/AnnouncementBar";
import SiteFooter from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <AnnouncementBar />
            <SiteHeader />
            {children}
            <SiteFooter />
        </div>
    );
}