import Logo from "./logo";

const items = [
  { title: "Home", link: "#" },
  { title: "Pricing", link: "#" },
  { title: "FAQ", link: "#" },
  { title: "Features", link: "#" },
];

export default function Footer() {
  return (
    <footer className="space-y-12 py-12 border-t md:flex md:justify-between md:items-center md:space-y-0">
      <div className="px-4">
        <Logo />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 px-4 place-items-start md:place-items-center gap-y-3">
        {items.map((item, i) => (
          <button className="text-gray-600 font-semibold" key={i}>
            {item.title}
          </button>
        ))}
      </div>

      <div className="px-4">
        <p className="text-gray-500">
          © 2077 Untitled UI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
