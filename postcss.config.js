/**
 * This file uses Next.js default PostCSS configuration ->
 * https://nextjs.org/docs/advanced-features/customizing-postcss-config#customizing-plugins
 */

module.exports = {
  plugins: [
    'tailwindcss',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009'
        }
        //     stage: 3,
        //     features: {
        //       'custom-properties': false
        //     }
      }
    ]
  ]
};
