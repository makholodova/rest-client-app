'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container">
      <h2>Error | {error.message}</h2>
      <button onClick={() => reset()}>reset</button>
    </div>
  );
}
