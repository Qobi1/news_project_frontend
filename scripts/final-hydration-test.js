const fs = require('fs');
const path = require('path');

console.log('🔍 Final Hydration Test - Comprehensive Check\n');

// Test 1: Check for conflicting files
console.log('1️⃣  CHECKING FOR CONFLICTING FILES:');
const conflictingFiles = [
  'index.html',
  'src/main.tsx', 
  'src/App.tsx',
  'vite.config.ts',
  'src/vite-env.d.ts'
];

let conflictsFound = false;
conflictingFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ❌ ${file} - CONFLICT!`);
    conflictsFound = true;
  } else {
    console.log(`   ✅ ${file} - Clean`);
  }
});

if (conflictsFound) {
  console.log('   ⚠️  Conflicts found - these can cause hydration errors');
} else {
  console.log('   ✅ No conflicts found');
}

// Test 2: Check hydration fixes in components
console.log('\n2️⃣  CHECKING HYDRATION FIXES:');
const filesToCheck = [
  'pages/index.tsx',
  'pages/search.tsx', 
  'components/RandomNews.tsx',
  'lib/useHydration.ts',
  'lib/utils.ts'
];

let hydrationFixesOk = true;
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file === 'pages/index.tsx' || file === 'pages/search.tsx') {
      if (content.includes('useHydration') && 
          content.includes('mounted ? formatDateSafe(article.date) : article.date') &&
          content.includes('{article.author || \'Новости Иркутска\'}')) {
        console.log(`   ✅ ${file} - Hydration fixes present`);
      } else {
        console.log(`   ❌ ${file} - Hydration fixes missing`);
        hydrationFixesOk = false;
      }
    }
    
    if (file === 'components/RandomNews.tsx') {
      if (content.includes('useHydration') && 
          content.includes('mounted ? formatDateSafe(article.date) : article.date')) {
        console.log(`   ✅ ${file} - Hydration fixes present`);
      } else {
        console.log(`   ❌ ${file} - Hydration fixes missing`);
        hydrationFixesOk = false;
      }
    }
    
    if (file === 'lib/useHydration.ts') {
      if (content.includes('useState') && content.includes('useEffect') && content.includes('setMounted')) {
        console.log(`   ✅ ${file} - Hydration hook implemented`);
      } else {
        console.log(`   ❌ ${file} - Hydration hook missing`);
        hydrationFixesOk = false;
      }
    }
    
    if (file === 'lib/utils.ts') {
      if (content.includes('try {') && content.includes('catch (error)') && 
          content.includes('return dateString; // Return original string')) {
        console.log(`   ✅ ${file} - Error handling implemented`);
      } else {
        console.log(`   ❌ ${file} - Error handling missing`);
        hydrationFixesOk = false;
      }
    }
  } else {
    console.log(`   ❌ ${file} - File missing`);
    hydrationFixesOk = false;
  }
});

// Test 3: Check Next.js configuration
console.log('\n3️⃣  CHECKING NEXT.JS CONFIGURATION:');
const nextjsFiles = [
  'next.config.js',
  'package.json',
  'pages/_app.tsx'
];

let nextjsConfigOk = true;
nextjsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} - Present`);
  } else {
    console.log(`   ❌ ${file} - Missing`);
    nextjsConfigOk = false;
  }
});

// Test 4: Check for any remaining old React SPA patterns
console.log('\n4️⃣  CHECKING FOR OLD REACT SPA PATTERNS:');
const oldPatterns = [
  'createRoot',
  'ReactDOM.render',
  'vite',
  'import.*App.*from.*App'
];

let oldPatternsFound = false;
const allFiles = fs.readdirSync(path.join(__dirname, '..'), { recursive: true });
allFiles.forEach(file => {
  if (typeof file === 'string' && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js'))) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      oldPatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          console.log(`   ⚠️  ${file} - Contains old pattern: ${pattern}`);
          oldPatternsFound = true;
        }
      });
    }
  }
});

if (!oldPatternsFound) {
  console.log('   ✅ No old React SPA patterns found');
}

// Final Summary
console.log('\n🎯 FINAL SUMMARY:');
console.log('================');

if (!conflictsFound && hydrationFixesOk && nextjsConfigOk && !oldPatternsFound) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('✅ No conflicting files');
  console.log('✅ Hydration fixes implemented');
  console.log('✅ Next.js configuration correct');
  console.log('✅ No old React SPA patterns');
  console.log('');
  console.log('🚀 READY TO TEST:');
  console.log('1. npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Check browser console - should be clean!');
  console.log('4. Test search functionality');
  console.log('5. Navigate between pages');
  console.log('');
  console.log('🎉 Hydration errors should be completely resolved!');
} else {
  console.log('⚠️  ISSUES FOUND:');
  if (conflictsFound) console.log('   • Conflicting files present');
  if (!hydrationFixesOk) console.log('   • Hydration fixes incomplete');
  if (!nextjsConfigOk) console.log('   • Next.js configuration issues');
  if (oldPatternsFound) console.log('   • Old React SPA patterns found');
  console.log('');
  console.log('Please resolve these issues before testing.');
}
