import Nav from "../components/Nav";
import "./globals.css";

export const metadata = {
  title: "Lattice Daily",
  description: "Daily lattice research reader"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
