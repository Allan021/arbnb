import Header from "@/components/Header";
import Footer from "@/components/Footer";

type PropertyLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: PropertyLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
}
