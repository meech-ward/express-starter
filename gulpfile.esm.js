import { series, parallel, src, dest, watch } from 'gulp'
import path from 'path'
import nodemon from 'gulp-nodemon'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import del from 'del'

const srcDir = 'src', destDir = 'dist'

const babelConfig = async () => babel(await import('./babel.config.js'))

/* 
Watch for changes to the destDir using nodemon
*/
export const nodeWatch = done => nodemon({
  script: 'bin/www',
  ignore: [srcDir],
  watch: [destDir],
  env: { 'NODE_ENV': 'development' },
  done: done
})

/*
Use babel to compile files
*/
const build = (srcPath, destPath, babelConfig) => 
  src([srcPath])
  .pipe(sourcemaps.init())
  .pipe(babelConfig)
  .pipe(sourcemaps.mapSources(sourcePath =>  path.join(__dirname, srcDir, sourcePath)))
  .pipe(sourcemaps.write())
  .pipe(dest(destPath))

/*
Use babel to compile everything from the srcDir into the destDir
*/
export const buildAll = async () =>  {
  let config = await babelConfig()
  console.log(config)
  // config = babel({
  //   presets: ['@babel/env']
  // })
  const thing = await import('./babel.config.js')
  console.log(thing)
  config = babel({presets: thing.presets})
  build(path.join(srcDir,'**/*.js'), destDir, config)
  return true
}

// Convert a filepath from src into a filepath to dest
const destPath = srcPath => srcPath.replace(srcDir, destDir)

/*
Use gulp to watch the files in the srcDir and compile them using babel when they change
*/
export const buildWatch = async () => {
  const watcher = watch([path.join(srcDir,'**/*')]);

  const compile = filePath => 
  build(filePath, path.parse(destPath(filePath)).dir, babelConfig)
  .on('end', () => console.log("compiled", filePath))
  
  const remove = filePath => 
  del([destPath(filePath)])
  .then(paths => console.log("removed", paths))

  watcher.on('change', compile)
  watcher.on('add', compile)
  watcher.on('unlink', remove)
  watcher.on('unlinkDir', remove)
}

const defaultTask = series(buildAll, parallel(buildWatch, nodeWatch))
export default defaultTask