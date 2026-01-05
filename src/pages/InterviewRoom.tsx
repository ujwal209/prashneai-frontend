import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  useConnectionState,
  ConnectionState,
  useLocalParticipant
} from "@livekit/components-react";
import "@livekit/components-styles";
import { 
  PhoneOff, Mic, MicOff, Loader2, 
  ChevronLeft, Wifi, AlertCircle
} from 'lucide-react';
import api from '@/lib/api';

const InterviewRoom = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch the LiveKit Token from your Backend
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchToken = async () => {
      try {
        // This hits your FastAPI endpoint: /api/livekit/token/{session_id}
        const { data } = await api.get(`/livekit/token/${sessionId}`);
        setToken(data.token);
        setServerUrl(data.server_url);
      } catch (e) {
        console.error(e);
        setError("Failed to connect to the interview server.");
      }
    };
    fetchToken();
  }, [sessionId]);

  if (error) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-red-600 gap-2">
      <AlertCircle className="w-5 h-5" /> {error}
    </div>
  );

  if (!token) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
    </div>
  );

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      className="h-screen w-screen bg-slate-50 font-sans overflow-hidden"
      onDisconnected={() => navigate('/hr/dashboard')}
    >
      <ActiveSession sessionId={sessionId || "Unknown"} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

// --- The Active Interface ---
const ActiveSession = ({ sessionId }: { sessionId: string }) => {
  const navigate = useNavigate();
  // LiveKit hooks for Agent State
  const { state: agentState, audioTrack } = useVoiceAssistant();
  const roomState = useConnectionState();
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (localParticipant) {
      const newVal = !isMuted;
      localParticipant.setMicrophoneEnabled(!newVal);
      setIsMuted(newVal);
    }
  };

  // Helper to format state text
  const getStatusText = () => {
    if (roomState === ConnectionState.Connecting) return "Connecting...";
    switch (agentState) {
      case 'listening': return "I'm listening...";
      case 'thinking': return "Thinking...";
      case 'speaking': return "Speaking...";
      default: return "Connected";
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-slate-50 isolate">
      
      {/* Background Ambient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 tracking-tight">Live Interview</h2>
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {sessionId.substring(0,8)}</p>
        </div>
        
        <div className="w-10" /> 
      </header>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
        
        {/* Status Text */}
        <div className="mb-12 text-center space-y-2">
           <h2 className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors duration-300 ${
             agentState === 'speaking' ? 'text-indigo-600' : 'text-slate-800'
           }`}>
             {getStatusText()}
           </h2>
           <p className="text-slate-500 font-medium">
             {agentState === 'listening' ? "Go ahead, speak freely." : "Prashne AI is analyzing your response."}
           </p>
        </div>

        {/* Professional Visualizer Container */}
        <div className={`
            relative w-full max-w-md h-32 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex items-center justify-center transition-all duration-300
            ${agentState === 'speaking' ? 'shadow-indigo-200 ring-2 ring-indigo-100' : ''}
        `}>
           {/* Visualizer Background */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50" />
           
           {audioTrack ? (
              <BarVisualizer
                state={agentState}
                barCount={20}
                trackRef={audioTrack}
                className="h-16 w-full z-10 opacity-80"
                style={{ height: '60px', width: '100%', gap: '4px' }} 
              />
           ) : (
              <div className="flex items-center gap-2 text-slate-300 animate-pulse">
                 <Wifi className="w-6 h-6" />
                 <span className="text-sm font-medium">Establishing Audio Stream...</span>
              </div>
           )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 z-20">
         <button 
           onClick={toggleMute}
           className={`p-5 rounded-full shadow-lg transition-all border ${
             isMuted 
             ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
             : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
           }`}
         >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
         </button>
         
         <button 
           onClick={() => navigate('/hr/dashboard')}
           className="p-5 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center"
         >
            <PhoneOff className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default InterviewRoom;