import { useHealth } from "./hooks/useHealth";

function App() {
  const { data, isLoading, isError } = useHealth();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">SpecSheet</h1>

        <p className="mt-3 text-zinc-400">
          Vehicle ownership, maintenance, and build management.
        </p>

        <div className="mt-8 rounded-lg border border-zinc-800 p-4">
          <p className="text-sm text-zinc-400">Backend status</p>

          {isLoading && <p className="mt-2">Checking API...</p>}

          {isError && (
            <p className="mt-2 text-red-400">
              Unable to connect to the backend.
            </p>
          )}

          {data && (
            <p className="mt-2 text-green-400">Connected to {data.service}</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
