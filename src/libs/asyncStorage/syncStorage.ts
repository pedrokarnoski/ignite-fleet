import AsyncStorage from "@react-native-async-storage/async-storage";

const ASYNC_STORAGE_KEY = "@ignite-fleet:last-sync";

export async function saveLastSyncTimestamp() {
  const now = new Date().getTime();

  await AsyncStorage.setItem(ASYNC_STORAGE_KEY, now.toString());

  return now;
}

export async function getLastSyncTimestamp() {
  const lastSync = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);

  return Number(lastSync);
}
