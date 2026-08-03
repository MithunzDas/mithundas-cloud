"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Sparkles, CheckCircle2, ShieldCheck, Users, Radio } from "lucide-react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function CustomVideoRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.roomId as string) || "discovery-call";
  
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [leadIdInput, setLeadIdInput] = useState("");
  const [completedNotification, setCompletedNotification] = useState<string | null>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize Jitsi Meet Embed
  const initJitsi = () => {
    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return;

    // Clean up existing instance if any
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: `mithundas-cloud-${roomId}`,
      width: "100%",
      height: "100%",
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: "Mithun Das (AI Architect)",
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        theme: "dark",
        toolbarButtons: [
          "microphone",
          "camera",
          "desktop",
          "chat",
          "raisehand",
          "tileview",
          "fullscreen",
          "participants-pane",
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: "#0b0f17",
        TOOLBAR_ALWAYS_VISIBLE: true,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    jitsiApiRef.current = api;

    // Event listeners
    api.addEventListener("participantJoined", () => {
      setParticipantCount((prev) => prev + 1);
    });

    api.addEventListener("participantLeft", () => {
      setParticipantCount((prev) => Math.max(1, prev - 1));
    });

    api.addEventListener("videoConferenceJoined", () => {
      startAudioRecording();
    });

    api.addEventListener("readyToClose", () => {
      handleEndCallAndProcess();
    });
  };

  // Start background mic/browser audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(1000); // collect 1s chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access for AI recording was denied or unavailable", err);
    }
  };

  // Stop recording and send audio blob to backend AI processing route
  const handleEndCallAndProcess = async () => {
    setIsProcessing(true);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Give 500ms for final audio chunks to assemble
    setTimeout(async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        if (audioBlob.size > 0) {
          const formData = new FormData();
          formData.append("audio", audioBlob, `meeting-${roomId}.webm`);
          formData.append("roomId", roomId);
          formData.append("leadId", leadIdInput || roomId);

          const response = await fetch("/api/admin/leads/transcribe-meeting", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            setCompletedNotification("✨ AI Meeting Insights & Technical Execution Plan Generated!");
          }
        }
      } catch (err) {
        console.error("Failed to upload audio for transcription", err);
      } finally {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
        }
        setIsProcessing(false);
      }
    }, 600);
  };

  useEffect(() => {
    if (jitsiLoaded) {
      initJitsi();
    }
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [jitsiLoaded]);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#080b11] text-white font-sans overflow-hidden select-none">
      {/* External Script Loader for Jitsi Meet API */}
      <Script
        src="https://meet.jit.si/external_api.js"
        onLoad={() => setJitsiLoaded(true)}
      />

      {/* Top Cyberpunk Header Bar */}
      <header className="flex h-14 w-full items-center justify-between border-b border-sky-500/20 bg-[#0f172a]/90 px-4 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="https://mithundas.cloud/logo.png" alt="Mithun Das AI" className="h-8 w-8 rounded-lg border border-sky-500/30" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-slate-100">Mithun Das AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold uppercase">
                Discovery Room #{roomId}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">High-Ticket Automation Architecture Session</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-3">
          {/* Participant counter badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300 border border-slate-700 font-mono">
            <Users className="h-3.5 w-3.5 text-sky-400" />
            <span>{participantCount} Active</span>
          </div>

          {/* Recording Status Indicator */}
          {isRecording && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 border border-emerald-500/30 font-mono animate-pulse">
              <Radio className="h-3.5 w-3.5 text-emerald-400" />
              <span>🔴 AI Notetaker Active</span>
            </div>
          )}

          {/* End Call & Process Button */}
          <button
            onClick={handleEndCallAndProcess}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-900/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                <span>Processing AI Insights...</span>
              </>
            ) : (
              <>
                <PhoneOff className="h-4 w-4" />
                <span>End Call &amp; Generate AI SOW</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Video Room Layout */}
      <main className="relative flex-1 w-full h-full bg-[#07090e]">
        {/* Jitsi Meet Container */}
        <div ref={jitsiContainerRef} className="w-full h-full" />

        {/* Loading Spinner overlay before Jitsi loads */}
        {!jitsiLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080b11] text-slate-400 space-y-3">
            <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-xs text-sky-400 tracking-wider">SECURE WEBRTC VIDEO ROOM INITIALIZING...</p>
          </div>
        )}

        {/* Post-Meeting Completion Modal Notification */}
        {completedNotification && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="max-w-md w-full rounded-xl bg-slate-900 border border-sky-500/40 p-6 shadow-2xl space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">{completedNotification}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The call transcript, multi-bullet client requirements, and your <strong>Step-by-Step Technical Execution Implementation Plan</strong> have been compiled into your Admin Dashboard.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => router.push("/admin/leads")}
                  className="rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-md shadow-sky-500/20"
                >
                  Go to Admin Dashboard ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
