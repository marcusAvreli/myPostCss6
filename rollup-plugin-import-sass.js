import {createFilter} from 'rollup-pluginutils';
import path from 'path'
import {renderSass} from './css.js'
const utils = require('./utils')
const chalk = require('chalk')

const plugin = ( /*include, exclude, output= false,postProcess,banner,sass,*/ options, ) => {
	  
	 options = Object.assign({
    include: [
      '**/*.css',
      '**/*.sass',
      '**/*.scss',
    ],
    exclude: undefined,
    output: false,
    postProcess: style => style,
    banner: '',
    sass: undefined,
  }, options)
   const filter = createFilter(options.include, options.exclude)
   
	 const styles = []
  const styleMaps = {}
  let dest = ''
    return {
        name: "import-sass-custom",
		  options (opts) {
			
      dest = typeof options.output === 'string'
        ? options.output
        : opts.output[0].file
			console.log("id:"+dest);
      if (dest && (dest.endsWith('.js') || dest.endsWith('.ts'))) {
        dest = dest.slice(0, -3)
        dest = `${dest}.css`
      }
    },
        async transform(code, id) {
			
				const htmlFiles = Object.keys(id).filter((i) => i.endsWith(".html"));
				console.log("fffffffffff:"+htmlFiles);
				console.log("fffffffffff:"+id);
				if (code.indexOf('@injectHTML') > -1) { 
					console.log("here got js:"+id);
				}
			 var _a;
            if (!filter(id))
                return null;
            
			
			 const paths = [path.dirname(id), process.cwd()]
			 console.log("checkPost_2:"+dest)
      const sassConfig = Object.assign({
        file: id,
        outFile: dest,
        sourceMap: options.sourceMap,
        data: code,
       
        omitSourceMapUrl: false,
        sourceMapContents: true,
      }, options.sass)
	  
      sassConfig.includePaths = sassConfig.includePaths
        ? sassConfig.includePaths.concat(paths.filter(x => !sassConfig.includePaths.includes(x)))
        : paths
		
    
	  const { css, map } = await renderSass(sassConfig);
	  console.log("here");
      code = css.toString().trim()
	 
     const sourcemap = {
                mappings: (_a = map === null || map === void 0 ? void 0 : map.toString()) !== null && _a !== void 0 ? _a : "",
            };
	  
			
			  if (!code) return
			

      return Promise.resolve({ id, dest, code, map })
        .then(options.postProcess)
        .then(style => {
         if (!styleMaps[id]) {
			 console.log("id before push:"+id);
			 console.log("id before push:"+code);
            styles.push(styleMaps[id] = style)
          }
		  
		
		
          if (options.output === false) {
		
		
            return {
              id,
              dest,
              code: `export default ${JSON.stringify(style.code)}`,
              map: style.map,
            }
			
          }
			
          return ''
        })
			
		
		},
		 generateBundle (_, bundle) {
		console.log("generate_bundle import css")
		const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"));
		console.log("generate_bundle import css:"+htmlFiles)
      if (!styles.length || options.output === false) {
        return
      }

      if (typeof options.output === 'function') {
        return options.output(styles)
      }

      if (!dest) return

      const res = utils.concatFiles(
        styles.map(({ id, code, map }) => ({
          code,
          map,
          sourcesRelativeTo: id,
        })),
        dest,
        options.banner,
      )

      return Promise.all([
        utils.writeFile(dest, res.code),
        utils.writeFile(dest + '.map', res.map),
      ]).then(([css, map]) => {
        console.log(chalk.green('created ' + css.path), chalk.gray(css.size))
        return { css, map }
      })
    }, closeBundle(){
			console.log("close plugin import sass");
		},
	buildEnd(){
		console.log("build_end");
	}
	}
}
export default plugin;