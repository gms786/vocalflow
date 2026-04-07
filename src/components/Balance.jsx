import { useEffect, useState } from "react";
import { fetchDeepgramBalances } from "../services/deepgram";
import { fetchGroqBalance } from "../services/groq";

export default function Balance() {
  const [projectId, setProjectId] = useState("");
  const [deepgram, setDeepgram] = useState({ loading: false, data: null, error: null });
  const [groq, setGroq] = useState({ loading: false, data: null, error: null });

  const loadDeepgram = async () => {
    if (!projectId) {
      setDeepgram({ loading: false, data: null, error: "Add a Deepgram Project ID." });
      return;
    }

    setDeepgram({ loading: true, data: null, error: null });
    try {
      const data = await fetchDeepgramBalances(projectId.trim());
      setDeepgram({ loading: false, data, error: null });
    } catch (error) {
      setDeepgram({ loading: false, data: null, error: error.message || "Unable to fetch balance." });
    }
  };

  const loadGroq = async () => {
    setGroq({ loading: true, data: null, error: null });
    try {
      const data = await fetchGroqBalance();
      setGroq({ loading: false, data, error: null });
    } catch (error) {
      setGroq({ loading: false, data: null, error: error.message || "Unable to reach Groq." });
    }
  };

  useEffect(() => {
    loadGroq();
  }, []);

  return (
    <div className="glass rounded-3xl p-6 space-y-5">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-electric/70">API Balances</p>
        <h3 className="text-xl font-semibold">Live usage overview</h3>
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-[0.25em] text-slate-200/60">Deepgram Project ID</label>
        <input
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          placeholder="project_12345..."
          className="w-full rounded-xl border border-electric/20 bg-slate/70 px-4 py-3 text-sm text-white focus:border-electric/60 focus:outline-none"
        />
        <button
          type="button"
          onClick={loadDeepgram}
          className="w-full rounded-xl bg-electric/20 px-4 py-2 text-sm font-semibold text-electric transition hover:bg-electric/30"
        >
          {deepgram.loading ? "Fetching Deepgram..." : "Refresh Deepgram Balance"}
        </button>
        {deepgram.error && (
          <p className="text-sm text-ember/80">{deepgram.error}</p>
        )}
        {deepgram.data && (
          <div className="rounded-2xl bg-slate/60 p-4 text-sm text-slate-100/90">
            {deepgram.data.balances?.length ? (
              <ul className="space-y-2">
                {deepgram.data.balances.map((balance) => (
                  <li key={balance.balance_id}>
                    {balance.amount} {balance.units} · {balance.purchase}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No balance data available.</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-[0.25em] text-slate-200/60">Groq Status</label>
        <button
          type="button"
          onClick={loadGroq}
          className="w-full rounded-xl bg-electric/20 px-4 py-2 text-sm font-semibold text-electric transition hover:bg-electric/30"
        >
          {groq.loading ? "Checking Groq..." : "Refresh Groq Status"}
        </button>
        {groq.error && <p className="text-sm text-ember/80">{groq.error}</p>}
        {groq.data && (
          <div className="rounded-2xl bg-slate/60 p-4 text-sm text-slate-100/90 space-y-2">
            <p>Connected: {groq.data.connected ? "Yes" : "No"}</p>
            <p className="text-slate-200/70">{groq.data.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
