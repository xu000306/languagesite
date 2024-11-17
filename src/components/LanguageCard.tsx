import React, { useState, useRef } from 'react';
import { Pencil, Trash2, Volume2, Save, X, Mic } from 'lucide-react';

interface LanguageCardProps {
  id: string;
  text: string;
  audioUrl: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, audioUrl: string) => void;
  isLocked: boolean;
}

export default function LanguageCard({ id, text, audioUrl, onDelete, onUpdate, isLocked }: LanguageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [isRecording, setIsRecording] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onUpdate(id, editedText, audioUrl);
        setAudioError(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setAudioError(true);
      });
    }
  };

  const handleSave = () => {
    onUpdate(id, editedText, audioUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        ) : (
          <p className="text-lg text-gray-800 font-medium">{text}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {audioUrl && (
              <>
                <button
                  onClick={handlePlayAudio}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Play Audio"
                  disabled={audioError}
                >
                  <Volume2 className={`w-5 h-5 ${audioError ? 'text-gray-400' : 'text-blue-600'}`} />
                </button>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onError={() => setAudioError(true)}
                >
                  <source src={audioUrl} type="audio/webm;codecs=opus" />
                  Your browser does not support the audio element.
                </audio>
              </>
            )}
            
            {isEditing && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-blue-600'}`}
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>

          {!isLocked && (
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-2 rounded-full hover:bg-green-100"
                    title="Save"
                  >
                    <Save className="w-5 h-5 text-green-600" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-full hover:bg-red-100"
                    title="Cancel"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="p-2 rounded-full hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}