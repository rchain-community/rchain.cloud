import parsePaths from './path_parser'

const input = [
  "/example/file1.txt",
  "/example/file2.txt",
  "/example/file3.txt",
  "/example/test/file4.doc",
  "/example/test/test2/file5",
  "/example/test3/test4/test5/file6.jpg",
  "/example/test/file7.rho"
]

const expected_output = [
  {
    module: 'example',
    path: '/example/',
    serverStorage: true,
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
        serverStorage: true,
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
            serverStorage: true,
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
        serverStorage: true,
        children: [
          {
            module: 'test4',
            path: '/example/test3/test4/',
            serverStorage: true,
            children: [
              {
                module: 'test5',
                path: '/example/test3/test4/test5/',
                serverStorage: true,
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

test('parse paths', () => {
  let output = parsePaths(input)
  expect(output).toEqual(expected_output)
})