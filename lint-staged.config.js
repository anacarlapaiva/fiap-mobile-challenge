module.exports = {
  '*': 'prettier --check --ignore-unknown',
  '*.{js,jsx,ts,tsx}': 'eslint --max-warnings 0',
  '*.{ts,tsx}': () => 'tsc --noEmit',
};
