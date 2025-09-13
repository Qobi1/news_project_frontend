const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Next.js Implementation...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'pages/_app.tsx',
  'pages/index.tsx',
  'pages/article/[id].tsx',
  'pages/search.tsx',
  'lib/api.ts',
  'lib/seo.ts',
  'lib/utils.ts',
  'types/index.ts',
  'components/SearchComponent.tsx',
  'components/RandomNews.tsx'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

console.log('\n✅ All required files exist!');

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDeps = ['next', 'react', 'react-dom', 'typescript'];
const requiredDevDeps = ['@types/node', '@types/react', '@types/react-dom', 'eslint', 'eslint-config-next'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING from dependencies`);
    allFilesExist = false;
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep} - ${packageJson.devDependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING from devDependencies`);
    allFilesExist = false;
  }
});

// Check TypeScript configuration
console.log('\n🔧 Checking TypeScript configuration...');
const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

if (tsConfig.compilerOptions && tsConfig.compilerOptions.jsx === 'preserve') {
  console.log('✅ TypeScript JSX configuration is correct');
} else {
  console.log('❌ TypeScript JSX configuration is incorrect');
  allFilesExist = false;
}

// Check Next.js configuration
console.log('\n⚙️ Checking Next.js configuration...');
if (fs.existsSync('next.config.js')) {
  console.log('✅ Next.js config file exists');
} else {
  console.log('❌ Next.js config file missing');
  allFilesExist = false;
}

// Summary
console.log('\n📊 Summary:');
if (allFilesExist) {
  console.log('✅ All checks passed! Your Next.js implementation is ready.');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Create .env.local file with your backend URL');
  console.log('3. Run: npm run dev');
  console.log('4. Open http://localhost:3000');
} else {
  console.log('❌ Some checks failed. Please review the issues above.');
  process.exit(1);
}
