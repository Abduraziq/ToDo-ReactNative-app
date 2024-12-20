# ToDo-ReactNative-app


A simple Todo List application built using React Native and AsyncStorage. This app allows users to create, edit, delete, and mark tasks as completed. All tasks are persisted locally using AsyncStorage.

## Features

- **Add a Task:** Create a new task and save it in the app.
- **Edit a Task:** Modify the title of an existing task.
- **Delete a Task:** Remove a task from the list.
- **Mark as Complete:** Toggle the completion status of tasks.
- **Persist Data:** Tasks are saved locally using AsyncStorage and persist across app restarts.

## Installation

Follow the instructions below to get the app running on your local machine:

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Android Studio (for Android emulator)
- React Native CLI

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app

### Install dependencies:

#### Use npm or yarn to install the required packages:

```bash
Copy code
npm install 
```
or
```
yarn install
```
### Run the app:

If you're using an Android emulator, start the emulator from Android Studio and run the app with:

```
npx react-native run-android
```
Alternatively, you can run the app on a physical device with USB debugging enabled.

# App Overview
The Todo App allows users to:

**View Active and Completed Tasks:** Tasks are divided into "Active" and "Completed" sections. Each task can be marked as completed and moved between these sections.
Add and Edit Tasks: Users can add new tasks via a modal or edit existing tasks by tapping on the task.

**Delete Tasks:** Users can delete tasks by tapping the delete icon.

**Persistent Storage:** Tasks are saved in AsyncStorage to ensure data persists even after the app is closed and reopened.

# License
This project is licensed under the MIT License - see the LICENSE file for details.

**Acknowledgements**

- React Native

- AsyncStorage

- MaterialCommunityIcons