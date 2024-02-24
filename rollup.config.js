import commonjs from 'rollup-plugin-commonjs'
import fs from 'fs'
import path from 'path'
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import resolve from 'rollup-plugin-node-resolve';
import sass from 'rollup-plugin-sass'
const { escapeRegExp, noop } = require('lodash')
import * as pkg from './package.json'
import util from 'util';
import mySass from './rollup-plugin-import-sass';
import cssnano from 'cssnano';
const utils = require('./utils')
const config = require('./config')
const replace = require('rollup-plugin-re')
const distDirectory = path.join(__dirname, './dist')
const srcDirectory = path.join(__dirname, './src')
const fsReaddir = util.promisify(fs.readdir);
const fsExists = util.promisify(fs.exists);
const fsMkdir = util.promisify(fs.mkdir);
const fsStat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);
//https://github.com/ghettovoice/vuelayers/blob/42379e6b63a32b092a77172f4e637094198579d3/.postcssrc.js
//https://github.com/phatnguyenuit/learn-rollup-basic/blob/b31c5b0802018b8765bd5f16d24599a171ecd935/custom-plugins/rollup/rollup-plugin-import-sass.js#L3
//https://github.com/markgarrigan/gelo/blob/8ab75ccf808ea9beebb5948feb0a607c70d02dc7/bin/gelo.js#L79
const bannerText = `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${pkg.license} License */`;
function injectInnerHTML() {
	
	
	return {
		name: 'injectInnerHTML',

		transform(code, id) {
			if (code.indexOf('@injectHTML') > -1) { 
			console.log("injectInnerHTML: called");
			}
			return {
				code: code,
				map: null
			};
			
		},generateBundle(code, id){
			 const htmlFiles = Object.keys(code).filter((i) => i.endsWith(".html"));
			console.log("injectInnerHTML: called generateBundle_1:"+htmlFiles);
			
			console.log("injectInnerHTML: called:"+JSON.stringify(id));
			console.log("injectInnerHTML: called:"+JSON.stringify(code));
			
		}, closeBundle(){
			console.log("injectInnerHTML: called generateBundle_2");
		}
	};
	console.log("rollup_checkPost_3");
}
function createDirectoryIfDoesNotExist(filePath) {
  const directoryName = path.dirname(filePath)
  if (fs.existsSync(directoryName)) {
    return true
  }
  createDirectoryIfDoesNotExist(directoryName)
  fs.mkdirSync(directoryName)
}
function writeCssFile(fileName, styles){
  createDirectoryIfDoesNotExist(exits.css)
  fs.writeFileSync(fileName, styles)
}
const sassOptions = {
	 options: {
          charset: false,
        },
		 include: ['**/*.scss'],
	// Processor will be called with two arguments:
	// - style: the compiled css
	// - id: import id
	processor(css) {
		return postcss([  
			autoprefixer({
				grid: false
			})
		])
		.process(css)
		.then(result => {
			console.log("processor");
			result.css
		
		});
	},
	// - styles: the contents of all style tags combined: 'body { color: green }'
	// - styleNodes: an array of style objects: { filename: 'body { ... }' }
	 output(styles, styleNodes) {
        
         // Complete CSS bundle
		 const sync = util.promisify(createDirectoryIfDoesNotExist)
		 
		 
		 //sync(path.resolve(__dirname, './dist')).then(() =>{
        fsMkdir(path.resolve(__dirname, './dist')).then(() => {
          return Promise.all([
            postcss([autoprefixer]).process(styles, { from: 'src' }),
            postcss([autoprefixer, cssnano({
              preset: 'default',
              postcssZindex: false,
              reduceIdents: false
            })]).process(styles, { from: 'src' })
          ])
        }).then(result => {
          writeFile(path.resolve(__dirname, './dist/yalterui.css'), bannerText + result[0].css, 'utf8')
          writeFile(path.resolve(__dirname, './dist/yalterui.min.css'), bannerText + result[1].css, 'utf8')
        })
		
		 for (const { id, content } of styleNodes) {
         //const minifiedCss = new CleanCSS({ level: { 2: { all: true } } }).minify(css);
		//	console.log("id:"+id);
        
        }
		
	 }
};
//const sassPlugin = sass({ sassOptions: { outputStyle: "expanded" } });
const sassOptions2 = {
	output: 'dest1',
	
	    banner: config.banner,
      sourceMap: true,
	  sass: {
        includePaths: [
          utils.resolve('src'),
          utils.resolve('src/styles'),
          utils.resolve('node_modules'),
        ],
      },
	postProcess: style => utils.postcssProcess(style, min),
}
const plugins = [
  resolve(),
  commonjs(), 
];
plugins.push(mySass(sassOptions2));
//plugins.push(sass(sassOptions));
const baseConf = {
  
  output: {
    format: 'es',
    banner: config.banner,
    name: config.fullname,
    sourcemap: true,
  },
}
const baseUmdConf = {
    input: config.umdEntry,
    output: {
      ...baseConf.output,
      format: 'umd',
     name:'testzoo'
     
    },
}
function makePlugins (min, replaces, cssOutput) {
	return [
	
    replace({
      sourceMap: true,
      include: [
        'src/**/*',
      ],
      replaces: {
        '@import ~': '@import ',
        '@import "~': '@import "',
        ...config.replaces,
        ...replaces,
      },
    }),
	  mySass({
      output: 'mySass.css',
      banner: config.banner,
      sourceMap: true,
      sass: {
        includePaths: [
          utils.resolve('src'),
          utils.resolve('src/scss'),
          utils.resolve('node_modules'),
        ],
      },
      postProcess: style => utils.postcssProcess(style, min),
    }),
	injectInnerHTML(),
	
	]
}
	


const rollupconfig = [{
	 
    ...baseUmdConf,
	//plugins: makePlugins(false),
	
    plugins: makePlugins(false, {
      'production': "'production'",
      'debug': 'false',
    }),
	
    output: {
      ...baseUmdConf.output,
      file: utils.resolve(`dist/${config.name}.umd.js`),
    },
  

}]
 
export default rollupconfig

//https://github.com/zambezi/ez-build/blob/d7f110b3cf136a3a6905d1c3723104a74ca1e5b8/src/builder/css.js#L17
//https://github.com/niksy/css-loader/blob/0c8a23b48521656d8f2ea4c14108b44882ecb0f2/src/plugins/postcss-url-parser.js#L107
//https://github.com/alexsasharegan/vue-flex/blob/master/rollup.config.js

//import postcssPlugin  from 'rollup-plugin-postcss'
//import CleanCSS from 'clean-css';
//import packageJson from './package.json'
//import clean from 'postcss-clean';
//import scss from 'rollup-plugin-scss';
//import {writeFileSync} from 'fs';
//import  normalize from 'postcss-normalize';
//import cssnano from 'cssnano';
//import rimraf from 'rimraf'
//import babel from 'rollup-plugin-babel'