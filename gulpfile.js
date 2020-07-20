import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import sassGlob from 'gulp-sass-glob'
import sync from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
import postcss from 'gulp-postcss'
import cleanCss from 'gulp-clean-css'
import cssDeclarationSorter from 'css-declaration-sorter'
import cssMqpacker from 'css-mqpacker'
import webpack from 'webpack-stream'
import TerserPlugin from 'terser-webpack-plugin'
import svgSprite from 'gulp-svg-sprite'

const paths = {
  styles: {
    src: 'src/scss/style.scss',
    all: 'src/scss/**/*.scss',
    build: 'build/css'
  },
  sprite: {
    src: 'src/images/spriteSvg/*',
    svg: '../../build/images/sprite.svg'
  },
  html: {
    src: 'src/index.html',
    all: 'src/**/*.html',
    build: 'build'
  },
  js: {
    src: 'src/js/script.js',
    all: 'src/js/**/*.js',
    build: 'build/js'
  }
}

export const sortMediaQueries = (a, b) => {
  const isMax = mq => /max-width/.test(mq)

  const isMin = mq => /min-width/.test(mq)

  const A = a.replace(/\D/g, '')

  const B = b.replace(/\D/g, '')

  if (isMax(a) && isMax(b)) {
    return B - A
  } else if (isMin(a) && isMin(b)) {
    return A - B
  } else if (isMax(a) && isMin(b)) {
    return 1
  } else if (isMin(a) && isMax(b)) {
    return -1
  }
  return 1
}

export const html = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(paths.html.build))
    .pipe(sync.stream())
}

export const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(
      sassGlob({
        ignorePaths: [
          'src/scss/utils/**',
          'src/scss/base/**',
          'src/scss/sprite/**'
        ]
      })
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true
      })
    )
    .pipe(
      cleanCss({
        level: 2
      })
    )
    .pipe(
      postcss([
        cssDeclarationSorter({
          order: 'smacss'
        }),
        cssMqpacker({
          sort: sortMediaQueries
        })
      ])
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.build))
    .pipe(sync.stream())
}

export const sprite = () => {
  return gulp.src(paths.sprite.src)
    .pipe(svgSprite({
      shape: {
        spacing: {
          padding: 5
        }
      },
      mode: {
        css: {
          dest: './',
          layout: 'diagonal',
          sprite: paths.sprite.svg,
          bust: false,
          render: {
            scss: {
              dest: 'sprite/_sprite.scss',
              template: 'src/scss/sprite/sprite-template.scss'
            }
          }
        }
      },
      variables: {
        mapname: 'icons'
      }
    }))
    .pipe(gulp.dest('src/scss'))
}

export const js = () => {
  return gulp.src(paths.js.src)
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'script.js'
      },
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    corejs: 3,
                    useBuiltIns: 'usage'
                  }]
                ]
              }
            }
          }
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            terserOptions: {
              extractComments: 'all',
              output: {
                comments: false
              }
            }
          })
        ]
      }
    }))
    .pipe(gulp.dest(paths.js.build))
    .pipe(sync.stream())
}

export const server = () => {
  sync.init({
    ui: false,
    notify: false,
    open: false,
    server: {
      baseDir: 'build'
    }
  })
}

export const watch = () => {
  gulp.watch(paths.html.all, gulp.series(html))
  gulp.watch(paths.styles.all, gulp.series(styles))
  gulp.watch(paths.js.all, gulp.series(js))
}

export const build = gulp.parallel(html, styles, js, sprite)

export default gulp.series(gulp.parallel(html, styles, js), sprite, gulp.parallel(watch, server))
