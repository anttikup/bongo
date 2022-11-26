export const SITE_TITLE = 'Duo Bongo';
export const MAX_HEALTH = 3;

export const EFFECTS_PATH = (fn: string) =>
    fn ? `/effects/${fn}` : "";

export const AUDIO_PATH = (fn: string) =>
    fn ? `/media/audio/${fn}` : "";

export const IMAGE_PATH = (fn: string) =>
    fn ? `/media/images/${fn}` : "";
