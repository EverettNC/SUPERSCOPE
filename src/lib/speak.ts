let player: HTMLAudioElement | null = null;
let objectUrl: string | null = null;

export function stopSpeaking() {
  if (player) {
    player.pause();
    player.src = "";
    player = null;
  }
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
}

export async function playGrokAudio(
  base64: string,
  type: string,
  onEnd?: () => void,
): Promise<boolean> {
  stopSpeaking();
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  objectUrl = URL.createObjectURL(new Blob([bytes], { type: type || "audio/mpeg" }));
  const audio = new Audio(objectUrl);
  player = audio;
  audio.onended = () => {
    stopSpeaking();
    onEnd?.();
  };
  audio.onerror = () => {
    stopSpeaking();
    onEnd?.();
  };
  try {
    await audio.play();
    return true;
  } catch {
    stopSpeaking();
    onEnd?.();
    return false;
  }
}
