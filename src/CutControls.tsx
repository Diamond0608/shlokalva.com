import { useEffect, useState, type MutableRefObject } from "react";
import { Scissors } from "lucide-react";

// Shared cutaway state: on/off, plus an optional manual depth (null = the slow automatic cycle).
export type CutState = { on: boolean; manual: number | null };
export const initialCut: CutState = { on: true, manual: null };

export function resolveCut(state: CutState, auto: number) {
  if (!state.on) return 0;
  return state.manual ?? auto;
}

export function CutControls({
  state,
  setState,
  liveRef,
  className = ""
}: {
  state: CutState;
  setState: (next: CutState) => void;
  liveRef: MutableRefObject<number>;
  className?: string;
}) {
  const [live, setLive] = useState(0);

  useEffect(() => {
    if (!state.on || state.manual !== null) return;
    const id = window.setInterval(() => setLive(liveRef.current), 200);
    return () => window.clearInterval(id);
  }, [state.on, state.manual, liveRef]);

  const value = !state.on ? 0 : state.manual ?? live;

  return (
    <div className={`cut-controls ${className}`} role="group" aria-label="Cutaway controls">
      <button
        onClick={() => setState({ ...state, on: !state.on })}
        aria-pressed={state.on}
        aria-label={state.on ? "Turn the cutaway off" : "Turn the cutaway on"}
      >
        <Scissors size={15} />
        <span>{state.on ? "Cutaway: On" : "Cutaway: Off"}</span>
      </button>
      <label className="cut-slider">
        <span>Depth</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(value * 100)}
          onChange={(event) => setState({ on: true, manual: Number(event.target.value) / 100 })}
          aria-label="Cutaway depth"
        />
      </label>
      {state.on && state.manual !== null && (
        <button onClick={() => setState({ ...state, manual: null })} aria-label="Return to the automatic cutaway cycle">
          <span>Auto</span>
        </button>
      )}
    </div>
  );
}
