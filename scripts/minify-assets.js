const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const terser = require('terser');

const root = process.cwd();

async function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) await visit(filename);
        if (!entry.isFile()) continue;
        if (entry.name.endsWith('.js')) {
            const source = fs.readFileSync(filename, 'utf8');
            const result = await terser.minify(source, { format: { comments: false } });
            if (!result.code) throw new Error(`Terser produced no output for ${filename}`);
            fs.writeFileSync(filename, result.code);
        }
    }
}

(async () => {
    await visit(root);
    const cssFile = path.join(root, 'main.css');
    if (fs.existsSync(cssFile)) {
        const source = fs.readFileSync(cssFile, 'utf8');
        const result = await postcss([cssnano({ preset: 'default' })]).process(source, { from: cssFile, to: cssFile });
        fs.writeFileSync(cssFile, result.css);
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
