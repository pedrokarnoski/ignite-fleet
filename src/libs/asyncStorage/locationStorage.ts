import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@ignite-fleet:location";

type LocationProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export async function getStorageLocations() {
  const storage = await AsyncStorage.getItem(STORAGE_KEY);
  const response = storage ? JSON.parse(storage) : null;

  return response;
}

export async function saveStorageLocation(newLocation: LocationProps) {
  const storage = await getStorageLocations();
  const newStorage = storage ? [...storage, newLocation] : [newLocation];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage));
}

export async function removeStorageLocations() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
