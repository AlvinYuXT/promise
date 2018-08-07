import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
  {
    input: 'src/index.js',
    output: {
      name: '_promise',
      file: 'dist/index.umd.js',
      format: 'umd'
    },
    plugins: [
      babel({
        include: 'src/**'
      }),
      resolve(),
      commonjs()
    ]
  }, {
    input: 'src/index.js',
    output: {
      name: '_promise',
      file: 'dist/index.umd.min.js',
      format: 'umd'
    },
    plugins: [
      babel({
        include: 'src/**'
      }),
      uglify(),
      resolve(),
      commonjs()
    ]
  }
]
