# Redux Data Structure Description

Redux handles the general state of the application. All of the React components can easily modify app state by calling Redux actions.
React components can also listen to the changes of the app state and re-render it's view if necessary.

State is organized into a single Javascript object with multiple keys. Main state object is composed of sub-states that are connected to specific app state.
For an example there is a sub-state called `files` that stores the state of the file structure connected to the sidebar file tree.

* `files` [`object`] - as mentioned earlier, stores the data about the file structure connected to the sidebar file tree. 
  * `active` [`object`] - property stores the currently selected file in the sidebar file tree.
  * `data` [`object`] - property stores the file tree structure. Full description of file tree structure can be found [**here**](./redux_file_tree_desc.md).
* `settings` [`object`] - property stores the general settings of the app. If any new options are added to the settings, they should be added here as well to ensure persistance.
  * `fullscreen` [`object`] - property stores the state of the Fullscreen Presentation Mode.
    * `enabled` [`boolean`] - property defines Fullscreen Presentation Mode state.
  * `modal` [`object`] - property stores the state of the settings modal.
    * `open` [`boolean`] - property defines the state of the settings modal.
  * `editor` [`object`] - property stores the settings of the Code Editor (**NOT IMPLEMENTED YET**).
    * `font-size` [`number`] - property stores the font size of the editor (**NOT IMPLEMENTED YET**).

``` javascript
{
  files: {
    active: {
      module: 'example_file.rho',
      path: '/root/example1/example2/example_file.rho',
      leaf: true
    }, 
    data: {
      ...
      /* File Tree Structure */
      /* Description located in ./redux_file_tree_desc.md */
      ...
    }
  },
  settings: {
    fullscreen: {
      enabled: false
    },
    modal: {
      open: false
    }
  }
}
```

## Redux reducers

* `files` state is handled by the [reducer_files.js](../frontend/src/reducers/reducer_files.js)
* `settings` state is handled by the [reducer_settings.js](../frontend/src/reducers/reducer_settings.js)

___
Author: Andrijan Ostrun