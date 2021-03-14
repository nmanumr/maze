import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/main.ts',
  plugins: [
    typescript()
  ],
  output: [
    {
      dir: "public/script/",
      format: "es",
      chunkFileNames: '[name]-[hash].[format].js',
      entryFileNames: '[name].[format].js',
      sourcemap: true,
    }
  ]
}
