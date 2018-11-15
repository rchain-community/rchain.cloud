# Notification Middleware Description

Notification system implementation includes displaying messages, information toasts, warnings and errors to the user.

Notification system is controlled via Notification Middleware [*`notifications.js`*](../../frontend/src/store/middleware/notifications.js) that stands between React app and Redux reducers.

Notification system is currently used to display error messages that appeared during frontend file system operations such as file creation and file renaming. To be precise and to show how notification middleware works underneath, file creation event will be examined:
> Redux action `FILE_ADDED` is dispatched when user tries to add new file or folder. File reducer checks if the new file name is valid, in case it is not `FILE_INVALID_NAME` action will be dispatched. Notification middleware will catch this action and it'll use `react-redux-toastr` module to display error message to the user. If the file name is valid, the file reducer checks if there are any existing files that could collide with the new file (there can not be two files with the same name in the same folder). If there are any collisions with existing files `FILE_ALREADY_EXISTS` actions will be dispatched and same as for `FILE_INVALID_NAME`, notification middleware will catch this action and display error message to the user.

Notification system is modular and new notifications can be implemented easily.

The [`react-redux-toastr`](https://github.com/diegoddox/react-redux-toastr) module is used to display these notifications to the page.

___
Author: Andrijan Ostrun
