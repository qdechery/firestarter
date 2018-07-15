// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
	apiKey: "AIzaSyC5KNIu3OAvTe8PG9LBL2XzFDyHG4NFcK0",
    authDomain: "firestarter-338fd.firebaseapp.com",
    databaseURL: "https://firestarter-338fd.firebaseio.com",
    projectId: "firestarter-338fd",
    storageBucket: "firestarter-338fd.appspot.com",
    messagingSenderId: "399321824146"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
