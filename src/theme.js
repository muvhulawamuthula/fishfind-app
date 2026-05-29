export const colors = {
  // Backgrounds
  bg:            '#F5F3FF',   // whisper of purple on white
  surface:       '#FFFFFF',   // pure white cards
  surfaceRaised: '#F0EDFB',   // inner cards / inputs
  border:        '#E4DFF5',   // subtle purple-tinted border
  borderBright:  '#A78BFA',   // highlighted border

  // Purple accent
  primary:       '#7C3AED',   // deep violet — used sparingly
  primaryDark:   '#6D28D9',
  primaryFaint:  '#EDE9FE',   // very light purple for active states

  // Text
  textPrimary:   '#1E1033',   // near-black with purple tint
  textSecondary: '#4B3F72',   // medium dark purple-gray
  textMuted:     '#9588B4',   // soft muted purple

  // Semantic
  success:       '#059669',
  successFaint:  '#D1FAE5',
  danger:        '#DC2626',
  dangerFaint:   '#FEE2E2',
  warning:       '#D97706',
  warningFaint:  '#FEF3C7',
  info:          '#2563EB',

  // Components
  inputBg:       '#F0EDFB',
  inputBorder:   '#D4CAEE',
  tabBar:        '#FFFFFF',
  tabBorder:     '#EDE9FE',
};

export const activityColor = (level) => {
  if (!level) return colors.textMuted;
  switch (level.toUpperCase()) {
    case 'HIGH':   return colors.success;
    case 'MEDIUM': return colors.warning;
    default:       return colors.textMuted;
  }
};

export const activityBg = (level) => {
  if (!level) return colors.surfaceRaised;
  switch (level.toUpperCase()) {
    case 'HIGH':   return colors.successFaint;
    case 'MEDIUM': return colors.warningFaint;
    default:       return colors.surfaceRaised;
  }
};
