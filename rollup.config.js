import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: './src/main.ts',
  preserveEntrySignatures: false,
  plugins: [
    nodeResolve(),
    typescript()
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
