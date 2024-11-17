import React, { useState, useRef } from 'react';
import { Plus, Mic, X } from 'lucide-react';

interface AddCardProps {
  onAdd: (text: string, audioUrl: string) => void;
}

export default function AddCard({ onAdd }: AddCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
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
        onAdd(text, audioUrl);
        resetForm();
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

  const resetForm = () => {
    setText('');
    setIsAdding(false);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      stopRecording();
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5 text-blue-600" />
        <span className="text-blue-600 font-medium">Add New Card</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your French text here..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isRecording
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            disabled={!text.trim()}
            title={!text.trim() ? 'Please enter text first' : ''}
          >
            <Mic className="w-5 h-5" />
            <span>{isRecording ? 'Stop Recording' : 'Record Audio'}</span>
          </button>

          <button
            onClick={resetForm}
            className="p-2 rounded-full hover:bg-red-100"
            title="Cancel"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}