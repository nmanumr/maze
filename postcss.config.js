module.exports = ({ env }) => ({
  plugins: {
    '@tailwindcss/jit': {},
    autoprefixer: {},
    cssnano: env === "production" ? { preset: "default", discardComments: { removeAll: true } } : false
  },
})
