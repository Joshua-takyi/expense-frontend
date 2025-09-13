import AppSidebar from "@/app/components/appsidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-auto ml-0 lg:ml-64">
        <div className="p-4 lg:p-3">{children}</div>
      </main>
    </div>
  );
}
