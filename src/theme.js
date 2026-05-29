export const colors = {
  // Backgrounds
  bg:            '#0D0B1A',
  surface:       '#141128',
  surfaceRaised: '#1C1840',
  border:        '#252048',
  borderBright:  '#4C3A96',

  // Purple
  primary:       '#8B5CF6',
  primaryDark:   '#7C3AED',
  primaryFaint:  '#2D1D6E',

  // Text
  textPrimary:   '#FFFFFF',
  textSecondary: '#C4B5FD',  // lavender
  textMuted:     '#6B5E8A',

  // Semantic
  success:       '#34D399',
  successFaint:  '#0A2E20',
  danger:        '#F87171',
  dangerFaint:   '#2D0D0D',
  warning:       '#FBBF24',
  warningFaint:  '#2A1800',
  info:          '#60A5FA',

  // Components
  inputBg:       '#1C1840',
  inputBorder:   '#3A2E80',
  tabBar:        '#090716',
  tabBorder:     '#1A1535',
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
