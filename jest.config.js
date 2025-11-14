module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo|expo-router|@supabase|@tanstack|@react-native|react-clone-referenced-element|@react-navigation)',
  ],
};
