const fs = require('fs');
const path = require('path');

function createBookmarklet() {
    try {
        // Ensure src directory exists and create the TypeScript file if it doesn't exist
        const srcDir = path.join(__dirname, 'src');
        if (!fs.existsSync(srcDir)) {
            console.log('📁 Creating src directory...');
            fs.mkdirSync(srcDir, { recursive: true });
        }

        // Ensure dist directory exists
        const distDir = path.join(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
            console.log('📁 Creating dist directory...');
            fs.mkdirSync(distDir, { recursive: true });
        }

        const minifiedPath = path.join(__dirname, 'dist', 'bookmarklet.min.js');

        if (!fs.existsSync(minifiedPath)) {
            console.error('❌ Minified file not found. Make sure the build completed successfully.');
            console.log('💡 Try running: npm run build');
            return;
        }

        const minifiedCode = fs.readFileSync(minifiedPath, 'utf8');
        const bookmarklet = `javascript:(function(){${minifiedCode}})();`;

        const outputPath = path.join(__dirname, 'bookmarklet.txt');
        fs.writeFileSync(outputPath, bookmarklet);

        console.log('✅ Bookmarklet created successfully!');
        console.log('📁 Saved to: bookmarklet.txt');
        console.log('📏 Size:', Math.round(bookmarklet.length / 1024), 'KB');
        console.log('');
        console.log('🔗 Copy the contents of bookmarklet.txt and create a new bookmark with that as the URL');
        console.log('');
        console.log('Next steps:');
        console.log('1. Get an OpenAI API key from https://platform.openai.com/');
        console.log('2. Visit any website and click your bookmarklet!');

    } catch (error) {
        console.error('❌ Error creating bookmarklet:', error.message || error);
    }
}

createBookmarklet();