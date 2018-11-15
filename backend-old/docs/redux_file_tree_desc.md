# Redux File Tree Structure Description

This is an example of Javascript object that holds file tree structure. 

The `module:'root'` object is the root object that is hidden on the frontend but it's necessary because we need to store the file tree structure as a single object.

Attribute `module` (`string`) is basically file/folder name, `path` (`string`) is full path each file in the structure and can be useful in future. 

The `children` (`Array`) attribute is an array of objects and it holds all files/folders that are in parent-child relation to the specific folder.
The `leaf` (`boolean`) attribute specifies that the specific node is a file and not folder.

The `collapsed` (`boolean`) attribute defines whether the folder is displayed as collapsed of expanded.

The `serverStorage` (`boolean`) attribute defined that file is stored on the server and can be fetched via HTTP request. 

``` javascript
{
    module: 'root',
    path: '',
    children: [
      {
        module: 'test-mock',
        path: '/test-mock/',
        children: [
          {
            module: 'react-ui-tree',
            path: '/test-mock/react-ui-tree/',
            children: [
              {
                module: 'dist',
                collapsed: true,
                path: '/test-mock/react-ui-tree/dist/',
                children: [
                  {
                    module: 'react-ui-tree.js',
                    leaf: true,
                    path: '/test-mock/react-ui-tree/dist/react-ui-tree.js'
                  },
                  {
                    module: 'tree.js',
                    leaf: true,
                    path: '/test-mock/react-ui-tree/dist/tree.js'
                  }
                ]
              },
              {
                module: 'example',
                path: '/test-mock/react-ui-tree/example/',
                children: [
                  {
                    module: 'app.less',
                    leaf: true,
                    path: '/test-mock/react-ui-tree/example/app.less'
                  },
                  {
                    module: 'index.html',
                    leaf: true,
                    path: '/test-mock/react-ui-tree/example/index.html'
                  }
                ]
              },
              {
                module: 'lib',
                path: '/test-mock/react-ui-tree/lib/',
                children: [
                  {
                    module: 'tree.js',
                    leaf: true,
                    path: '/test-mock/react-ui-tree/lib/tree.js'
                  }
                ]
              },
              {
                module: 'README.md',
                leaf: true,
                path: '/test-mock/react-ui-tree/README.md'
              },
              {
                module: 'webpack.config.js',
                leaf: true,
                path: '/test-mock/react-ui-tree/webpack.config.js'
              },
              {
                module: 'index.html',
                leaf: true,
                path: '/test-mock/react-ui-tree/index.html'
              }
            ]
          }
        ]
      },
      {
        module: 'workspace',
        path: '/workspace/',
        children: [

        ]
      },
      {
        module: 'example',
        path: '/example/',
        children: [
          {
            module: 'file1.txt',
            path: '/example/file1.txt',
            serverStorage: true,
            leaf: true
          },
          {
            module: 'file2.txt',
            path: '/example/file2.txt',
            serverStorage: true,
            leaf: true
          },
          {
            module: 'file3.txt',
            path: '/example/file3.txt',
            serverStorage: true,
            leaf: true
          },
          {
            module: 'test',
            path: '/example/test/',
            children: [
              {
                module: 'file4.doc',
                path: '/example/test/file4.doc',
                serverStorage: true,
                leaf: true
              },
              {
                module: 'test2',
                path: '/example/test/test2/',
                children: [
                  {
                    module: 'file5',
                    path: '/example/test/test2/file5',
                    serverStorage: true,
                    leaf: true
                  }
                ]
              },
              {
                module: 'file7.rho',
                path: '/example/test/file7.rho',
                serverStorage: true,
                leaf: true
              }
            ]
          },
          {
            module: 'test3',
            path: '/example/test3/',
            children: [
              {
                module: 'test4',
                path: '/example/test3/test4/',
                children: [
                  {
                    module: 'test5',
                    path: '/example/test3/test4/test5/',
                    children: [
                      {
                        module: 'file6.jpg',
                        path: '/example/test3/test4/test5/file6.jpg',
                        serverStorage: true,
                        leaf: true
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
  ]
}
```

___
Author: Andrijan Ostrun