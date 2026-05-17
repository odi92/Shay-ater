export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-6 flex items-center justify-center bg-black">
      <p className="font-sans text-sm text-white/60">
        All rights reserved to Shay Ater. {year}
      </p>
    </footer>
  );
}
