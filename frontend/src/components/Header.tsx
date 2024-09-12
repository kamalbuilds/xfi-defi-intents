import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="navbar p-0 items-center px-2">
      <div className="flex-1 gap-4 w-fit">
        <Image src="/images/circled.png" width={60} height={60} alt="logo" />
        <Link href="/" className="bg-none">
          <h1 className="text-6xl mt-2 font-['Reverie']">MetaIntents</h1>
        </Link>
      </div>
      <div className="flex-none gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <w3m-button />
      </div>
    </div>
  );
};
