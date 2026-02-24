import AsyncStorage from '@react-native-async-storage/async-storage';

const HANDS_KEY = 'poker_hands_v1';

export async function loadHands() {
  try {
    const raw = await AsyncStorage.getItem(HANDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveHands(hands) {
  try {
    await AsyncStorage.setItem(HANDS_KEY, JSON.stringify(hands));
  } catch (e) {
    console.warn('Failed to save hands:', e);
  }
}
