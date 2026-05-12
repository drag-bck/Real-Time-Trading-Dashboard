import { useStore } from "../store";

export default function Header() {
  const { username, logout } = useStore();
  return (
    <header className="border-b border-line bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold leading-none">Markets</h1>
          <p className="text-xs text-muted mt-1">Real-time trading dashboard</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted">Signed in as <span className="text-ink font-medium">{username}</span></span>
          <button onClick={logout} className="px-3 py-1.5 border border-line rounded-md hover:bg-bg">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
