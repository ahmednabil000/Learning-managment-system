/**
 * Converts duration from seconds to a human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {object} - Object with value and unit { value: number, unit: string, formatted: string }
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) {
    return { value: 0, unit: "seconds", formatted: "0s" };
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // If duration is less than 60 seconds, show in seconds
  if (seconds < 60) {
    return {
      value: secs,
      unit: "seconds",
      formatted: `${secs}s`,
    };
  }

  // If duration is less than 1 hour, show in minutes
  if (seconds < 3600) {
    return {
      value: minutes,
      unit: "minutes",
      formatted: `${minutes}m`,
    };
  }

  // If duration is 1 hour or more, show in hours and minutes
  if (minutes > 0) {
    return {
      value: hours,
      unit: "hours",
      formatted: `${hours}h ${minutes}m`,
    };
  }

  // Exactly X hours
  return {
    value: hours,
    unit: "hours",
    formatted: `${hours}h`,
  };
};

/**
 * Converts duration from seconds to minutes
 * @param {number} seconds - Duration in seconds
 * @returns {number} - Duration in minutes (rounded)
 */
export const secondsToMinutes = (seconds) => {
  return Math.round(seconds / 60);
};

/**
 * Converts duration from seconds to hours
 * @param {number} seconds - Duration in seconds
 * @returns {number} - Duration in hours (rounded to 1 decimal)
 */
export const secondsToHours = (seconds) => {
  return Math.round((seconds / 3600) * 10) / 10;
};
