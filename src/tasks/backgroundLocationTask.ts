import { saveStorageLocation } from "@/libs/asyncStorage/locationStorage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const BACKGROUND_TASK_NAME = "location-tracking";

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
  try {
    if (error) {
      throw error;
    }

    if (data) {
      const { coords, timestamp } = data.locations[0];

      const currentLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
      };

      await saveStorageLocation(currentLocation);
    }
  } catch (error) {
    console.error(error);

    stopLocationTask();
  }
});

export async function startLocationTask() {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    if (hasStarted) {
      await stopLocationTask();
    }

    await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 1,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function stopLocationTask() {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
    }
  } catch (error) {
    console.error(error);
  }
}
