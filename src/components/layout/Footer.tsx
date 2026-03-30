export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <p className="text-sm text-gray-600">
            Copyright © {new Date().getFullYear()} IDS Africa Limited. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
