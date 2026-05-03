import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, RotateCcw, PhoneCall } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AudioCallPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLine, setActiveLine] = useState(-1);
  const [script, setScript] = useState([]);

  useEffect(() => {
    fetch(`${API}/audio/demo-call/script`)
      .then((r) => r.json())
      .then((d) => setScript(d.lines || []))
      .catch(() => setScript([]));
  }, []);

  // Estimate per-line offsets based on character length once duration is known
  const lineOffsets = (() => {
    if (!duration || !script.length) return [];
    const totalChars = script.reduce((s, l) => s + l.text.length, 0) || 1;
    let acc = 0;
    return script.map((l) => {
      const start = (acc / totalChars) * duration;
      acc += l.text.length;
      return start;
    });
  })();

  useEffect(() => {
    if (!lineOffsets.length) return;
    let idx = -1;
    for (let i = 0; i < lineOffsets.length; i++) {
      if (currentTime >= lineOffsets[i]) idx = i;
    }
    setActiveLine(idx);
  }, [currentTime, lineOffsets.length]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      return;
    }
    if (!loaded) {
      setLoading(true);
      setError(null);
      try {
        audio.src = `${API}/audio/demo-call`;
        await audio.play();
        setLoaded(true);
      } catch (e) {
        setError("Couldn't load the demo call. Try again.");
        setLoading(false);
        return;
      }
    } else {
      try {
        await audio.play();
      } catch (e) {
        setError("Playback failed.");
        return;
      }
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const onLoadedMeta = () => {
    setLoading(false);
    if (audioRef.current?.duration && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setActiveLine(-1);
  };

  const fmt = (t) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="hear-it"
      data-testid="audio-player-section"
      className="relative bg-slate-50 py-24 md:py-32 border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5">
            <div className="mono-overline text-blue-600">04 / Hear it live</div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-[-0.03em] leading-[0.95] mt-3 text-slate-950">
              Press play.<br />
              <span className="text-blue-600">It's not a script.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              An actual ServiceSpeak call — emergency AC outage, real
              dispatch, booking confirmed in 38 seconds. Two AI voices. Zero
              humans on the line.
            </p>
          </div>
        </div>

        <div className="relative bg-slate-950 text-white border-2 border-slate-950 shadow-[16px_16px_0_rgba(37,99,235,1)]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="relative flex w-2.5 h-2.5">
                <span
                  className={`absolute inset-0 rounded-full ${
                    isPlaying ? "bg-emerald-500 ss-pulse" : "bg-slate-600"
                  }`}
                />
                <span
                  className={`relative rounded-full w-2.5 h-2.5 ${
                    isPlaying ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                />
              </span>
              <span className="mono-overline text-slate-400">
                {isPlaying
                  ? "LIVE PLAYBACK · IN PROGRESS"
                  : loaded
                  ? "READY"
                  : "DEMO CALL · 30 SECONDS"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall size={14} className="text-blue-400" />
              <span className="mono-overline text-slate-500 hidden sm:inline">
                INBOUND · (312) 555-0118
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-12">
            {/* LEFT — Player controls */}
            <div className="md:col-span-5 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
              <div>
                <div className="mono-overline text-slate-500 mb-3">
                  Now playing
                </div>
                <div className="font-display font-extrabold text-2xl md:text-3xl leading-tight">
                  Emergency AC dispatch
                </div>
                <div className="text-sm text-slate-400 font-semibold mt-2">
                  Apex Heating &amp; Air · Denver, CO
                </div>
              </div>

              {error && (
                <div className="mt-6 text-xs font-bold text-red-400 mono-overline">
                  ERR · {error}
                </div>
              )}

              {/* Wave bars visualizer */}
              <div className="my-8 flex items-end gap-1 h-14">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 ${
                      isPlaying ? "wave-bar bg-blue-500" : "bg-slate-700"
                    }`}
                    style={{
                      animationDelay: `${(i % 6) * 90}ms`,
                      height: `${20 + ((i * 13) % 80)}%`,
                    }}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div
                  className="h-1.5 bg-slate-800 relative cursor-pointer"
                  onClick={(e) => {
                    if (!duration || !audioRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = pct * duration;
                  }}
                  data-testid="audio-progress-bar"
                >
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-blue-500 transition-[width] duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between mono-overline text-slate-500">
                  <span data-testid="audio-current-time">
                    {fmt(currentTime)}
                  </span>
                  <span data-testid="audio-duration">{fmt(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  disabled={loading}
                  data-testid="audio-play-toggle"
                  className="group w-14 h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 flex items-center justify-center transition-all hover:-translate-y-0.5"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={20} fill="white" strokeWidth={0} />
                  ) : (
                    <Play
                      size={20}
                      fill="white"
                      strokeWidth={0}
                      className="ml-0.5"
                    />
                  )}
                </button>

                <button
                  onClick={handleRestart}
                  data-testid="audio-restart"
                  disabled={!loaded}
                  className="w-12 h-12 border border-slate-700 hover:border-slate-500 disabled:opacity-40 flex items-center justify-center transition-colors"
                  aria-label="Restart"
                >
                  <RotateCcw size={16} className="text-slate-300" />
                </button>

                <div className="ml-auto flex items-center gap-2 text-slate-500">
                  <Volume2 size={14} />
                  <span className="mono-overline text-[0.55rem]">HQ AUDIO</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Live transcript */}
            <div className="md:col-span-7 p-6 md:p-10 max-h-[480px] overflow-y-auto">
              <div className="mono-overline text-slate-500 mb-5">
                Live transcript
              </div>
              {script.length === 0 ? (
                <div className="text-sm text-slate-500 font-medium">
                  Loading transcript…
                </div>
              ) : (
                <div className="space-y-4" data-testid="audio-transcript">
                  {script.map((line, i) => {
                    const isActive = i === activeLine && isPlaying;
                    const isPast = i < activeLine;
                    const isAgent = line.speaker === "agent";
                    return (
                      <div
                        key={i}
                        className={`flex gap-3 transition-all duration-300 ${
                          isPast && !isActive ? "opacity-50" : ""
                        }`}
                        data-testid={`transcript-line-${i}`}
                      >
                        <div
                          className={`w-8 h-8 shrink-0 flex items-center justify-center mono-overline text-[0.55rem] ${
                            isAgent
                              ? "bg-blue-600 text-white"
                              : "bg-slate-800 border border-slate-700 text-slate-400"
                          }`}
                        >
                          {isAgent ? "AI" : "JD"}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`mono-overline text-[0.55rem] mb-1 ${
                              isAgent ? "text-blue-400" : "text-slate-500"
                            }`}
                          >
                            {isAgent
                              ? "SERVICESPEAK AI · SARAH"
                              : "CALLER · JAMIE"}
                          </div>
                          <p
                            className={`text-sm md:text-base leading-relaxed font-medium transition-colors ${
                              isActive
                                ? "text-white"
                                : isAgent
                                ? "text-slate-300"
                                : "text-slate-400"
                            }`}
                          >
                            {line.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Booking confirmation footer */}
                  <div
                    className={`mt-6 border p-4 flex items-center justify-between transition-all ${
                      currentTime >= duration * 0.85 && duration
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900/50"
                    }`}
                  >
                    <div>
                      <div className="mono-overline text-emerald-400 text-[0.55rem]">
                        BOOKING CONFIRMED · 0:38
                      </div>
                      <div className="text-sm font-bold text-white mt-1">
                        Today · 4:00 – 6:00 PM · Emergency AC
                      </div>
                    </div>
                    <div className="font-display font-black text-3xl text-emerald-400">
                      ✓
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          preload="none"
          onLoadedMetadata={onLoadedMeta}
          onCanPlay={onLoadedMeta}
          onTimeUpdate={onTimeUpdate}
          onPlay={() => {
            setIsPlaying(true);
            setLoading(false);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={onEnded}
          onError={() => {
            setError("Failed to load audio.");
            setLoading(false);
            setIsPlaying(false);
          }}
          data-testid="audio-element"
        />
      </div>
    </section>
  );
};

export default AudioCallPlayer;
