// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/',
  eventOptions: ['pick_up', 'delivery_service', 'staffed_event', 'all'],
  courseOptions: ['all', 'entree', 'main', 'desert', 'soup'],
  eventStartTimeOptions: [
    '9.00am',
    '9.30am',
    '10.00am',
    '10.30am',
    '11.00am',
    '11.30am',
    '12.00pam',
    '12.30pn',
    '1.00pm',
    '2.00pm',
    '2.30pm',
    '3.00pm',
    '3.30pm',
    '4.00pm',
    '4.30pm',
    '5.00pm',
    '5.30pm',
    '6.00pm'
  ]
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
