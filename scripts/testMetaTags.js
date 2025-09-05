// Test script to verify meta tags are working correctly
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testMetaTags() {
  console.log('🧪 Testing Meta Tags Solution...\n');
  
  try {
    // Test home page
    console.log('1. Testing home page...');
    const homeResponse = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeResponse.text();
    
    if (homeHtml.includes('<title>Новости Иркутска - Последние новости и события</title>')) {
      console.log('   ✅ Home page title is correct');
    } else {
      console.log('   ❌ Home page title is incorrect');
    }
    
    // Test article page
    console.log('\n2. Testing article page...');
    const articleResponse = await fetch(`${BASE_URL}/?id=1`);
    const articleHtml = await articleResponse.text();
    
    // Check for dynamic title (should not be generic)
    if (articleHtml.includes('<title>') && !articleHtml.includes('Статья 1 — Новости Иркутска')) {
      console.log('   ✅ Article page has dynamic title');
    } else {
      console.log('   ❌ Article page has static/generic title');
    }
    
    // Check for Open Graph tags
    if (articleHtml.includes('property="og:title"') && articleHtml.includes('property="og:description"')) {
      console.log('   ✅ Open Graph meta tags are present');
    } else {
      console.log('   ❌ Open Graph meta tags are missing');
    }
    
    // Check for JSON-LD structured data
    if (articleHtml.includes('application/ld+json') && articleHtml.includes('NewsArticle')) {
      console.log('   ✅ JSON-LD structured data is present');
    } else {
      console.log('   ❌ JSON-LD structured data is missing');
    }
    
    // Extract and display the actual title
    const titleMatch = articleHtml.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      console.log(`   📰 Article title: ${titleMatch[1]}`);
    }
    
    console.log('\n🎉 Meta tags test completed!');
    console.log('\n📋 To verify manually:');
    console.log(`   1. Visit: ${BASE_URL}/?id=1`);
    console.log('   2. Right-click → "View Page Source"');
    console.log('   3. Look for <title> and <meta> tags');
    console.log('   4. Verify they show real article data');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the SSR server is running:');
    console.log('   npm run start');
  }
}

// Run the test
testMetaTags();
