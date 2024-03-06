export default function Home() {
  return (
    <div>
      {/* Submenu */}
      <div className="border-b border-b-gray-200 flex justify-center">
        <div className="px-8 max-w-6xl w-full flex py-3 items-center">
          <button className="px-3 py-1 text-md font-semibold text-gray-700">
            Filename.txt
          </button>

          <button className="px-3 py-1 text-md font-semibold text-gray-700">
            Documents
          </button>
        </div>
      </div>
    </div>
  );
}
