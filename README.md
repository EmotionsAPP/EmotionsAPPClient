# EmotionsAPPClient

This is the Client for the EmotionsAPP project. This is an Expo based project, some components are native so project should be run on device or emulator.

## Installation 

Clone the repository and run 
```bash
npm install 
```

If there is a package dependency conflict run 
```bash
expo doctor --fix-dependencies
```

## Execution 

To run the project on android run 
```bash
expo run:android
```

Tu run the project on ios run 
```bash
expo run:ios
```

## Contributing

Comments on pull request are welcome, please make sure to resolve the comments before merging the pull request. 
Pull requests to the dev branch only need for one approval to be merge, please make sure to review the pull request thoroughly.

Also make sure to update test accordingly.

## Notes 

Connection to the API can be tricky on emulators, if your are running the API locally make sure to edit the references on /store/services/index.ts
