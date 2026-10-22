export const metadata = { title: "Loan", robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="fr"><body>{children}</body></html>);
}
