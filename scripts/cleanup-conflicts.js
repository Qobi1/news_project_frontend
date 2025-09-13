const fs = require('fs');
const path = require('path');

console.log('🧹 Checking for Conflicting Files...\n');

// Files that should NOT exist in Next.js project
const conflictingFiles = [
  'index.html',           // Old React SPA entry point
  'src/main.tsx',         // Old React SPA entry point
  'src/App.tsx',          // Old React SPA main component
  'vite.config.ts',       // Vite configuration
  'src/vite-env.d.ts'     // Vite type definitions
];

console.log('📄 Checking for Conflicting Files:');
let conflictsFound = false;

conflictingFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`❌ ${file} - CONFLICT FOUND!`);
    conflictsFound = true;
  } else {
    console.log(`✅ ${file} - Removed`);
  }
});

if (conflictsFound) {
  console.log('\n⚠️  CONFLICTS DETECTED!');
  console.log('These files can cause hydration errors in Next.js.');
  console.log('Please remove them manually.');
} else {
  console.log('\n✅ NO CONFLICTS FOUND!');
  console.log('All conflicting files have been removed.');
}

// Check if Next.js files exist
const nextjsFiles = [
  'pages/_app.tsx',
  'pages/index.tsx',
  'pages/article/[id].tsx',
  'next.config.js',
  'package.json'
];

console.log('\n📄 Checking Next.js Files:');
let nextjsFilesMissing = false;

nextjsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Present`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    nextjsFilesMissing = true;
  }
});

if (nextjsFilesMissing) {
  console.log('\n⚠️  MISSING NEXT.JS FILES!');
  console.log('Some required Next.js files are missing.');
} else {
  console.log('\n✅ ALL NEXT.JS FILES PRESENT!');
}

console.log('\n🎯 SUMMARY:');
if (!conflictsFound && !nextjsFilesMissing) {
  console.log('✅ Project is clean and ready for Next.js');
  console.log('✅ No conflicting files found');
  console.log('✅ All required Next.js files present');
  console.log('✅ Hydration errors should be resolved');
} else {
  console.log('⚠️  Issues found that need to be resolved');
}

console.log('\n🚀 NEXT STEPS:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Check browser console for hydration errors');
console.log('4. Test search functionality');
