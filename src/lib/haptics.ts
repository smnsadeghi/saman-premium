/**
 * Subtle vibration patterns for native-feeling mobile haptic feedback.
 */
function vibrate(pattern: number | number[]) {
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if not allowed by browser permissions
    }
  }
}

/**
 * Ultra-light tick for button taps and item selections
 */
export function tapLight() {
  vibrate(10);
}

/**
 * Ritual transition vibration: soft swell on window opening
 */
export function ritualOpen() {
  vibrate([15, 40, 25]);
}

/**
 * Urgent SOS pulsing feedback
 */
export function sosPulse() {
  vibrate([30, 50, 30, 50, 60]);
}

/**
 * Gentle double-tap for completed actions
 */
export function successFeedback() {
  vibrate([12, 30]);
}
