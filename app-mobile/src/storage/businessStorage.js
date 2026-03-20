import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "selected_business";

export const saveBusiness = (business) => AsyncStorage.setItem(KEY, JSON.stringify(business));
export const getBusiness = async () => {
  const value = await AsyncStorage.getItem(KEY);
  return value ? JSON.parse(value) : null;
};
export const clearBusiness = () => AsyncStorage.removeItem(KEY);
