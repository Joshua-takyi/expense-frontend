export default function Wrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${className} container mx-auto max-w-[95rem]`}>
      {children}
    </div>
  );
}
