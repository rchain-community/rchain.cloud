export default {
  active: {
    module: 'react-ui-tree.js',
    undragable: true,
    leaf: true,
    path: '/react-ui-tree/dist/react-ui-tree.js'

  },
  module: 'react-ui-tree',
  undragable: true,
  path: '/react-ui-tree/',
  children: [
    {
      module: 'dist',
      collapsed: true,
      undragable: true,
      path: '/react-ui-tree/dist/',
      children: [
        {
          module: 'react-ui-tree.js',
          undragable: true,
          leaf: true,
          path: '/react-ui-tree/dist/react-ui-tree.js'
        },
        {
          module: 'tree.js',
          undragable: true,
          leaf: true,
          path: '/react-ui-tree/dist/tree.js'
        }
      ]
    },
    {
      module: 'example',
      undragable: true,
      path: '/react-ui-tree/example/',
      children: [
        {
          module: 'app.less',
          undragable: true,
          leaf: true,
          path: '/react-ui-tree/example/app.less'
        },
        {
          module: 'index.html',
          undragable: true,
          leaf: true,
          path: '/react-ui-tree/example/index.html'
        }
      ]
    },
    {
      module: 'lib',
      undragable: true,
      path: '/react-ui-tree/lib/',
      children: [
        {
          module: 'tree.js',
          undragable: true,
          leaf: true,
          path: '/react-ui-tree/lib/tree.js'
        }
      ]
    },
    {
      module: 'README.md',
      undragable: true,
      leaf: true,
      path: '/react-ui-tree/README.md'
    },
    {
      module: 'webpack.config.js',
      undragable: true,
      leaf: true,
      path: '/react-ui-tree/webpack.config.js'
    },
    {
      module: 'index.html',
      undragable: true,
      leaf: true,
      path: '/react-ui-tree/index.html'
    }
  ]
}
