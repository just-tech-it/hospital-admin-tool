/* Simple API service to fetch hospital data. */

const BASE_URL = "/data";

export const fetchShifts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/shifts.json`);
    if (!response.ok) throw new Error("Failed to fetch shifts");
    return await response.json();
  } catch (error) {
    console.error("Error in fetchShifts:", error);
    throw error;
  }
};

export const fetchBeds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/beds.json`);
    if (!response.ok) throw new Error("Failed to fetch beds");
    return await response.json();
  } catch (error) {
    console.error("Error in fetchBeds:", error);
    throw error;
  }
};

/**
 * Combines both requests into a single call for the Context to use.
 */
export const fetchInitialData = async () => {
  try {
    const [shiftsData, bedsData] = await Promise.all([
      fetchShifts(),
      fetchBeds(),
    ]);
    return { shiftsData, bedsData };
  } catch (error) {
    throw new Error("Failed to load initial clinical data");
  }
};