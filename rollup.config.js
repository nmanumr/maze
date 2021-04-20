import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from "rollup-plugin-terser";

export default {
  input: './src/main.ts',
  preserveEntrySignatures: false,
  manualChunks(id) {
    if (id.includes('rxjs')) {
      return 'rxjs';
    }
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    process.env.NODE_ENV === 'production' ? terser() : null
  ],
  output: [
    {
      dir: "public/script/",
      format: "es",
      chunkFileNames: '[name].[format].js',
      entryFileNames: '[name].[format].js',
      sourcemap: true,
    }
  ]
}
