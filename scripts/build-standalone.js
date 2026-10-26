// Build the complete game as one offline HTML file using only Node built-ins.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^\uFEFF/,'');
let html=read('index.html').replace('href="./"','href="#"');
const assets={};function walk(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory())walk(file);else if(file.endsWith('.svg'))assets[file]='data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,file)).toString('base64')}}walk('assets');
for(const f of ['style.css','campaign.css'])html=html.replace(new RegExp('<link rel="stylesheet" href="'+f.replace(/\./g,'\\.')+'(?:\\?[^"]*)?">'),()=>`<style>${read(f)}</style>`);
for(const f of ['upgrade-catalog.js','data.js','core.js','campaign-art.js','app.js']){
  const tag=new RegExp('<script src="'+f.replace(/\./g,'\\.')+'(?:\\?[^\"]*)?"></script>');
  html=html.replace(tag,()=>`<script>${f==='upgrade-catalog.js'?'window.TrazZAssets='+JSON.stringify(assets)+';':''}\n${read(f).replace(/<\/script/gi,'<\\/script')}\n</script>`);
}
for(const [file,uri]of Object.entries(assets))html=html.replaceAll(`src="${file}"`,`src="${uri}"`).replaceAll(`href="${file}"`,`href="${uri}"`);
fs.writeFileSync(path.join(root,'TrazZ.html'),html);console.log('Built TrazZ.html: complete offline game with embedded artwork and all 26 upgrade trees.');
