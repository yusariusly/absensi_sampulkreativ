import { useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';

        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(
          (voice) => voice.lang.startsWith('id') || voice.lang === 'id-ID'
        );
        if (idVoice) {
          utterance.voice = idVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Gagal memicu SpeechSynthesis:', err);
      }
    }
  }, []);

  return { speak };
};
