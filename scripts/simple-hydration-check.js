const fs = require('fs');
const path = require('path');

console.log('🔍 Simple Hydration Check - Focus on Application Files\n');

// Check only the main application files, not node_modules or build files
const appFiles = [
  'pages/index.tsx',
  'pages/search.tsx',
  'pages/article/[id].tsx',
  'components/SearchComponent.tsx',
  'components/RandomNews.tsx',
  'lib/useHydration.ts',
  'lib/utils.ts',
  'pages/_app.tsx'
];

console.log('📄 Checking Application Files for Hydration Issues:');
let allGood = true;

appFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for problematic patterns
    const hasOldPatterns = content.includes('createRoot') || 
                          content.includes('ReactDOM.render') ||
                          content.includes('import.*App.*from.*App');
    
    if (hasOldPatterns) {
      console.log(`   ❌ ${file} - Contains old React SPA patterns`);
      allGood = false;
    } else {
      console.log(`   ✅ ${file} - Clean`);
    }
    
    // Check for hydration fixes
    if (file.includes('index.tsx') || file.includes('search.tsx')) {
      if (content.includes('useHydration') && 
          content.includes('mounted ? formatDateSafe(article.date) : article.date')) {
        console.log(`   ✅ ${file} - Hydration fixes present`);
      } else {
        console.log(`   ❌ ${file} - Hydration fixes missing`);
        allGood = false;
      }
    }
  } else {
    console.log(`   ❌ ${file} - File missing`);
    allGood = false;
  }
});

// Check for conflicting files
console.log('\n📄 Checking for Conflicting Files:');
const conflictingFiles = [
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'vite.config.ts'
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

console.log('\n🎯 SUMMARY:');
if (allGood && !conflictsFound) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('✅ Application files are clean');
  console.log('✅ No conflicting files found');
  console.log('✅ Hydration fixes implemented');
  console.log('');
  console.log('🚀 READY TO TEST:');
  console.log('1. npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Check browser console - should be clean!');
  console.log('');
  console.log('🎉 Hydration errors should be resolved!');
} else {
  console.log('⚠️  ISSUES FOUND:');
  if (!allGood) console.log('   • Application files have issues');
  if (conflictsFound) console.log('   • Conflicting files present');
  console.log('');
  console.log('Please resolve these issues before testing.');
}
