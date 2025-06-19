
export interface RoleDetectionResult {
  isVideoEditor: boolean;
  isAppointmentSetter: boolean;
  isContentCreator: boolean;
}

export const detectRoleType = (roleName?: string): RoleDetectionResult => {
  if (!roleName) {
    // Default to appointment setter when no role is specified
    return {
      isVideoEditor: false,
      isAppointmentSetter: true,
      isContentCreator: false,
    };
  }

  const lowerRoleName = roleName.toLowerCase();
  
  // Video Editor detection - comprehensive patterns
  const isVideoEditor = lowerRoleName.includes('video') && 
                        (lowerRoleName.includes('editor') || lowerRoleName.includes('edit')) ||
                        lowerRoleName.includes('video editor');
  
  // Content Creator detection
  const isContentCreator = lowerRoleName.includes('content') && 
                           lowerRoleName.includes('creator') ||
                           lowerRoleName.includes('content creator');
  
  // Appointment Setter detection
  const isAppointmentSetter = lowerRoleName.includes('appointment') && 
                              lowerRoleName.includes('setter') ||
                              lowerRoleName.includes('appointment setter') ||
                              (!isVideoEditor && !isContentCreator); // Default fallback
  
  return {
    isVideoEditor: isVideoEditor || isContentCreator, // Content creators use video editor flow
    isAppointmentSetter,
    isContentCreator,
  };
};

export const isVideoEditorRole = (roleName?: string): boolean => {
  return detectRoleType(roleName).isVideoEditor;
};

export const isAppointmentSetterRole = (roleName?: string): boolean => {
  return detectRoleType(roleName).isAppointmentSetter;
};
