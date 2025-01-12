// Sound effect URLs (using short, lightweight sound files)
const SOUND_EFFECTS = {
  build: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  destroy: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  attack: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  upgrade: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3'
};

class SoundManager {
  private audioElements: { [key: string]: HTMLAudioElement } = {};
  private enabled = true;

  constructor() {
    // Preload audio elements
    Object.entries(SOUND_EFFECTS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audioElements[key] = audio;
    });
  }

  play(effect: keyof typeof SOUND_EFFECTS) {
    if (!this.enabled) return;
    
    const audio = this.audioElements[effect];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay blocking errors
      });
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundManager = new SoundManager();