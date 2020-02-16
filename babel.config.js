const presets = exports.presets = [
  ['@babel/env', {
    targets: {
      node: 'current',
    },
    useBuiltIns: 'usage',
    corejs: {version: 3, proposals: true},
    shippedProposals: true,
  }],
];

const plugins = exports.plugins = [
  // React
  '@babel/transform-react-jsx',
];

exports.ignore = ['node_modules'];

if(process.env.NODE_ENV === 'development') {
  plugins.push(
    // React
    '@babel/transform-react-display-name',
    '@babel/transform-react-jsx-self',
  );
} else {
  presets.push([
    'minify',
    {builtIns: false},
  ]);

  plugins.push(
    // minification
    'transform-inline-environment-variables',
    'transform-node-env-inline',

    // React
    '@babel/transform-react-constant-elements',
    '@babel/transform-react-inline-elements',
  );
}
