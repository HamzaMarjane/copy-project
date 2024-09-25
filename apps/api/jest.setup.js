const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  console.log('Running Prisma generate...');
  execSync('pnpm prisma generate', {
    cwd: path.join(__dirname, '../../packages/db'),
    stdio: 'inherit',
  });
};