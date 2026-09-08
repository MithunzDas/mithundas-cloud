"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  Mic,
  Video,
  PhoneOff,
  Sparkles,
  CheckCircle2,
  Users,
  Radio,
  Disc,
  Server,
  UserCheck,
  Copy,
  ChevronRight,
  Volume2,
  LogIn,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
    webkitAudioContext: typeof AudioContext;
  }
}

// Host access password (hashed comparison in production, simple check here)
const HOST_ACCESS_KEY = "Mithun@01";

export default function CustomVideoRoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = (params?.roomId as string) || "discovery-call";
  const urlIsHost = searchParams?.get("host") === "true" || searchParams?.get("host") === "1";
  const queryName = searchParams?.get("name") || "";

  // Identity & Role states
  const [isHost, setIsHost] = useState(false); // Start as false, must authenticate
  const [wantsHost, setWantsHost] = useState(urlIsHost);
  const [hostPassword, setHostPassword] = useState("");
  const [hostAuthError, setHostAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState(queryName || "Client Guest");
  const [hasJoined, setHasJoined] = useState(false);
  const [clientInfo, setClientInfo] = useState<{ name?: string; company?: string; email?: string } | null>(null);

  // Use meet.element.io — high-availability community Jitsi server with full iframe embedding support and NO mandatory lobby
  const JITSI_SERVER = "meet.element.io";

  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedNotification, setCompletedNotification] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);

  // AI Notetaker / Two-Way Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamTracksRef = useRef<MediaStreamTrack[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch booking details for this roomId
  useEffect(() => {
    async function loadBookingInfo() {
      try {
        const res = await fetch(`/api/book/details?bookingId=${encodeURIComponent(roomId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.found) {
            setClientInfo(data);
            if (!urlIsHost && !queryName) {
              const formattedName = data.name + (data.company ? ` (${data.company})` : "");
              setUserName(formattedName);
            }
          }
        }
      } catch (err) {
        // Fallback to defaults
      }
    }
    loadBookingInfo();
  }, [roomId, urlIsHost, queryName]);

  // Host authentication handler
  const handleHostAuth = () => {
    if (hostPassword === HOST_ACCESS_KEY) {
      setIsHost(true);
      setHostAuthError("");
      setUserName("Mithun Das (Host - AI Architect)");
    } else {
      setHostAuthError("Incorrect host access key. Please try again.");
    }
  };

  // Initialize Jitsi Meet Embed
  const initJitsi = () => {
    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return;

    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.warn("Error disposing previous Jitsi instance", e);
      }
    }

    const roomIdentifier = `mithundas-cloud-${roomId}`.toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const options = {
      roomName: roomIdentifier,
      width: "100%",
      height: "100%",
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: isHost ? "Mithun Das (Host - AI Architect)" : (userName || "Client Guest"),
        email: isHost ? "mithun.here01@gmail.com" : (clientInfo?.email || "guest@client.com"),
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        prejoinConfig: {
          enabled: false,
        },
        disableDeepLinking: true,
        enableLobby: false,
        enableClosePage: false,
        theme: "dark",

        // WebRTC P2P + Bridge support
        p2p: {
          enabled: true,
          useStunTurn: true,
        },

        toolbarButtons: [
          "microphone",
          "camera",
          "desktop",
          "chat",
          "raisehand",
          "tileview",
          "fullscreen",
          "participants-pane",
          "settings",
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: "#080b11",
        TOOLBAR_ALWAYS_VISIBLE: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
      },
    };

    try {
      const api = new window.JitsiMeetExternalAPI(JITSI_SERVER, options);
      jitsiApiRef.current = api;

      api.addEventListener("participantJoined", () => {
        setParticipantCount((prev) => prev + 1);
      });

      api.addEventListener("participantLeft", () => {
        setParticipantCount((prev) => Math.max(1, prev - 1));
      });

      api.addEventListener("readyToClose", () => {
        if (isHost) {
          handleEndCallAndProcess();
        } else {
          router.push("/");
        }
      });

      // Inject enhanced iframe permissions immediately and observe DOM changes
      const applyPermissions = () => {
        const iframe = jitsiContainerRef.current?.querySelector("iframe");
        if (iframe) {
          iframe.setAttribute(
            "allow",
            "camera *; microphone *; display-capture *; autoplay *; clipboard-write *; fullscreen *; speaker *"
          );
          iframe.setAttribute("allowfullscreen", "true");
        }
      };

      applyPermissions();
      const observer = new MutationObserver(() => {
        applyPermissions();
      });
      if (jitsiContainerRef.current) {
        observer.observe(jitsiContainerRef.current, { childList: true, subtree: true });
      }
      setTimeout(applyPermissions, 500);
      setTimeout(applyPermissions, 1500);
    } catch (err) {
      console.error("Failed to initialize Jitsi Meet", err);
    }
  };

  // Mount Jitsi once user clicks "Join Meeting"
  useEffect(() => {
    if (jitsiLoaded && hasJoined) {
      initJitsi();
    }
    return () => {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {}
      }
    };
  }, [jitsiLoaded, hasJoined]);

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTwoWayRecording = async (mode: "both" | "mic") => {
    setShowRecordModal(false);
    audioChunksRef.current = [];
    audioStreamTracksRef.current = [];

    try {
      let combinedAudioStream: MediaStream;

      if (mode === "both" && navigator.mediaDevices.getDisplayMedia) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        displayStream.getTracks().forEach((track) => audioStreamTracksRef.current.push(track));

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        micStream.getTracks().forEach((track) => audioStreamTracksRef.current.push(track));

        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtxClass();
        audioContextRef.current = audioCtx;
        const destination = audioCtx.createMediaStreamDestination();

        const displayAudioTracks = displayStream.getAudioTracks();
        if (displayAudioTracks.length > 0) {
          const displaySource = audioCtx.createMediaStreamSource(new MediaStream(displayAudioTracks));
          displaySource.connect(destination);
        }

        const micSource = audioCtx.createMediaStreamSource(micStream);
        micSource.connect(destination);

        combinedAudioStream = destination.stream;

        displayStream.getVideoTracks().forEach((track) => {
          track.onended = () => {
            console.log("Tab sharing ended by user");
          };
        });
      } else {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        micStream.getTracks().forEach((track) => audioStreamTracksRef.current.push(track));
        combinedAudioStream = micStream;
      }

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(combinedAudioStream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err: any) {
      console.warn("AI recording setup was cancelled or unavailable", err);
      if (err.name !== "AbortError" && mode === "both") {
        alert("Tab audio capture was cancelled. You can also choose 'Record My Mic Only' if preferred.");
      }
    }
  };

  const stopRecordingStreams = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    audioStreamTracksRef.current.forEach((track) => {
      try {
        track.stop();
      } catch (e) {}
    });
    audioStreamTracksRef.current = [];

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleEndCallAndProcess = async () => {
    setIsProcessing(true);
    stopRecordingStreams();

    setTimeout(async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        if (audioBlob.size > 2000) {
          const formData = new FormData();
          formData.append("audio", audioBlob, `meeting-${roomId}.webm`);
          formData.append("roomId", roomId);
          formData.append("leadId", roomId);

          const response = await fetch("/api/admin/leads/transcribe-meeting", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            setAiInsights(data.insights || null);
            setCompletedNotification("✨ AI Meeting Insights & Technical Execution Plan Generated!");
          } else {
            setCompletedNotification("Session Ended. Call audio recorded successfully.");
          }
        } else {
          setCompletedNotification("Session Ended.");
        }
      } catch (err) {
        console.error("Failed to upload audio for transcription", err);
        setCompletedNotification("Session Ended.");
      } finally {
        if (jitsiApiRef.current) {
          try {
            jitsiApiRef.current.dispose();
          } catch (e) {}
        }
        setIsProcessing(false);
      }
    }, 600);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-[#080b11] text-white font-sans overflow-hidden select-none">
      <Script
        src={`https://${JITSI_SERVER}/external_api.js`}
        onLoad={() => setJitsiLoaded(true)}
      />

      {/* Top Header Bar */}
      <header className="flex h-14 w-full items-center justify-between border-b border-sky-500/20 bg-[#0f172a]/95 px-3 sm:px-4 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img
            src="https://mithundas.cloud/logo.png"
            alt="Mithun Das AI"
            className="h-8 w-8 rounded-lg border border-sky-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-slate-100">Mithun Das AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold uppercase">
                Room #{roomId.slice(0, 10)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">High-Ticket Automation Architecture Session</p>
          </div>
        </div>

        {/* Right Status & Action Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Indicator */}
          {hasJoined && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono border ${
                isHost
                  ? "bg-sky-500/15 text-sky-300 border-sky-500/40 font-semibold"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {isHost ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
              <span className="max-w-[120px] truncate">{isHost ? "Host: Mithun" : userName}</span>
            </div>
          )}

          {/* Participant count */}
          {hasJoined && (
            <div className="flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 border border-slate-700 font-mono">
              <Users className="h-3.5 w-3.5 text-sky-400" />
              <span>{participantCount}</span>
            </div>
          )}

          {/* HOST ONLY: AI Notetaker Controls */}
          {isHost && hasJoined && (
            <>
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-400 border border-red-500/40 font-mono animate-pulse">
                    <Radio className="h-3.5 w-3.5 text-red-400" />
                    <span>REC {formatTimer(recordingSeconds)}</span>
                  </div>
                  <button
                    onClick={stopRecordingStreams}
                    className="hidden sm:inline-flex text-[11px] font-mono text-slate-400 hover:text-slate-200 underline"
                  >
                    Stop
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowRecordModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold font-mono transition-all shadow-sm"
                >
                  <Disc className="h-3.5 w-3.5 text-emerald-400 animate-spin" style={{ animationDuration: "4s" }} />
                  <span className="hidden sm:inline">Start AI Notetaker</span>
                  <span className="sm:hidden">AI Rec</span>
                </button>
              )}

              <button
                onClick={handleEndCallAndProcess}
                disabled={isProcessing}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-red-900/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-300" />
                    <span className="hidden sm:inline">Generating SOW...</span>
                  </>
                ) : (
                  <>
                    <PhoneOff className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">End &amp; Generate SOW</span>
                    <span className="sm:hidden">End</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* GUEST: Leave Call */}
          {!isHost && hasJoined && (
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-all"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span>Leave</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 w-full h-full bg-[#080b11]">
        {/* PRE-JOIN SCREEN */}
        {!hasJoined ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-gradient-to-b from-[#0b0f19] to-[#07090e]">
            <div className="max-w-md w-full rounded-2xl bg-slate-900/90 border border-sky-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Video className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Ready to Join Discovery Call?
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Session Room: <strong className="text-sky-300 font-mono">{roomId}</strong>
                </p>
              </div>

              {/* HOST AUTH: Password Gate */}
              {wantsHost && !isHost ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                    <Lock className="h-4 w-4" />
                    <span>Host Authentication Required</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Enter Host Access Key:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={hostPassword}
                        onChange={(e) => { setHostPassword(e.target.value); setHostAuthError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleHostAuth()}
                        placeholder="Enter host password"
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none pr-10"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {hostAuthError && (
                      <p className="text-xs text-red-400 font-medium">{hostAuthError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleHostAuth}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold py-3 text-sm shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authenticate as Host</span>
                  </button>
                  <button
                    onClick={() => { setWantsHost(false); setHostAuthError(""); }}
                    className="w-full text-xs text-slate-500 hover:text-slate-300 font-mono underline"
                  >
                    ← Join as Client Guest instead
                  </button>
                </div>
              ) : (
                <>
                  {/* Display Name Input */}
                  <div className="text-left space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
                      Your Display Name:
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  {/* Role Info */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                    <span className="text-slate-400">
                      Role: <strong className={isHost ? "text-sky-400" : "text-emerald-400"}>{isHost ? "Host (Mithun Das)" : "Client Guest"}</strong>
                    </span>
                    {!isHost && (
                      <button
                        type="button"
                        onClick={() => setWantsHost(true)}
                        className="text-sky-400 hover:text-sky-300 underline font-mono text-[11px]"
                      >
                        I am Mithun (Host)
                      </button>
                    )}
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => setHasJoined(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold py-3.5 text-sm shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Enter Video Meeting Room</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Direct P2P Encrypted WebRTC Session</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Jitsi Meet Container */}
            <div ref={jitsiContainerRef} className="w-full h-full" />

            {/* Loading Spinner */}
            {!jitsiLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080b11] text-slate-400 space-y-3 z-20">
                <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-xs text-sky-400 tracking-wider">
                  CONNECTING AS {userName.toUpperCase()}...
                </p>
              </div>
            )}
          </>
        )}

        {/* Modal: Start AI Notetaker Options */}
        {showRecordModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full rounded-xl bg-slate-900 border border-sky-500/40 p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Start AI Discovery Notetaker</h3>
                  <p className="text-xs text-slate-400">Record conversation to auto-generate technical SOW</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => startTwoWayRecording("both")}
                  className="w-full flex items-start gap-3 p-3.5 rounded-lg border border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/15 text-left transition-all group"
                >
                  <Volume2 className="h-5 w-5 text-sky-400 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">Record Both Voices (Call + Mic)</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Select <strong className="text-slate-200">&quot;This Tab&quot;</strong> and keep{" "}
                      <strong className="text-slate-200">&quot;Share tab audio&quot;</strong> checked.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => startTwoWayRecording("mic")}
                  className="w-full flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left transition-all"
                >
                  <Mic className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-sm font-bold text-slate-200">Record My Microphone Only</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Quick start. Only records your microphone.
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post-Meeting Completion Modal */}
        {completedNotification && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
            <div className="max-w-xl w-full rounded-xl bg-slate-900 border border-sky-500/40 p-6 shadow-2xl space-y-4 my-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-white">{completedNotification}</h3>
                <p className="text-xs text-slate-400">
                  Meeting audio was compiled into executive insights and technical deliverables.
                </p>
              </div>

              {aiInsights && (
                <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-lg p-4 text-xs">
                  {aiInsights.suggestedSOW && (
                    <div>
                      <span className="text-[11px] font-mono text-sky-400 font-bold uppercase">Executive SOW</span>
                      <p className="text-slate-200 mt-0.5 font-medium">{aiInsights.suggestedSOW}</p>
                    </div>
                  )}

                  {aiInsights.clientPainPoints?.length > 0 && (
                    <div>
                      <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">Client Pain Points</span>
                      <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                        {aiInsights.clientPainPoints.map((pt: string, idx: number) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiInsights.technicalImplementationPlan && (
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                          Technical Implementation Plan
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiInsights.technicalImplementationPlan);
                            setCopiedPlan(true);
                            setTimeout(() => setCopiedPlan(false), 2000);
                          }}
                          className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copiedPlan ? "Copied!" : "Copy Plan"}</span>
                        </button>
                      </div>
                      <div className="max-h-40 overflow-y-auto bg-slate-900/90 rounded p-2 text-slate-300 font-mono text-[11px] whitespace-pre-wrap">
                        {aiInsights.technicalImplementationPlan}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => router.push("/admin/leads")}
                  className="rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-md shadow-sky-500/20 flex items-center gap-2"
                >
                  <span>Go to Admin Leads Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCompletedNotification(null)}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
