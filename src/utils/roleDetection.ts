
export const detectRoleType = (roleName?: string) => {
  if (!roleName) {
    return {
      isVideoEditor: false,
      isAppointmentSetter: false,
      isCustomerService: false
    };
  }

  const roleNameLower = roleName.toLowerCase();
  
  return {
    isVideoEditor: roleNameLower.includes('video') || roleNameLower.includes('editor'),
    isAppointmentSetter: roleNameLower.includes('appointment') || roleNameLower.includes('setter'),
    isCustomerService: roleNameLower.includes('customer') || roleNameLower.includes('service')
  };
};
