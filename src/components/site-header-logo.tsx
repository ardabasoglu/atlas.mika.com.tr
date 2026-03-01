import Image from "next/image";

export function SiteHeaderLogo() {
  return (
    <a
      href="https://mika.com.tr"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-auto flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Mika — mika.com.tr"
    >
      <Image
        src="/mika-transparent-dark-logo.png"
        alt="Mika"
        width={240}
        height={64}
        className="h-14 w-auto"
        priority
      />
    </a>
  );
}
