
import { ApplicationFormData } from './formSchema';

const STORAGE_KEY = 'application-form-data';
const VOICE_STORAGE_KEY = 'application-voice-recording';

export const loadSavedFormData = (): Partial<ApplicationFormData> | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading saved form data:', error);
  }
  return null;
};

export const saveFormData = (data: Partial<ApplicationFormData>) => {
  try {
    const dataToSave = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== undefined && value !== '' && value !== false
      )
    );
    
    if (Object.keys(dataToSave).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const clearSavedData = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VOICE_STORAGE_KEY);
};
