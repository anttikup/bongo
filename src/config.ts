export const SITE_TITLE = 'Duo Bongo';
export const MAX_HEALTH = 3;

export const AUDIO_PATH = (fn: string) =>
    fn ? `/static/audio/${fn}` : "";

export const IMAGE_PATH = (fn: string) =>
    fn ? `/images/${fn}` : "";
