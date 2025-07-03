import type { FC } from 'react';

const NotFoundPage: FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px]">
    <h2 className="text-4xl font-bold mb-4 text-orange-400">404 - Page Not Found</h2>
    <p className="text-lg text-neutral-200 mb-6">The page you are looking for does not exist.</p>
    <a href="/" className="px-6 py-2 rounded bg-orange-400 text-black font-semibold hover:bg-orange-500 transition">Back to Dashboard</a>
  </div>
);

export default NotFoundPage; 