const storage = new Map();

export default {
  setItem: jest.fn((key, value) => Promise.resolve(storage.set(key, value))),
  getItem: jest.fn((key) => Promise.resolve(storage.get(key) ?? null)),
  removeItem: jest.fn((key) => Promise.resolve(storage.delete(key))),
  clear: jest.fn(() => Promise.resolve(storage.clear())),
};
