// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: "https://localhost:5001/api/v1/",
  baseWebSocket: 'http://localhost:5001/hub',
  loginSSOURL:
    "http://localhost:59288/#/login?redir=http://localhost:4200/&subtitle=Centro de Cobranza",
  TokenSSO:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiIxMGY0YjllNS01MDkwLTQ3Y2EtOGM0OC0wOGQ3Njk4MDBlYWUiLCJlbWFpbCI6InJvZHJpZ28udmF6cXVlekBub3ZpdC5jb20uYXIiLCJyYXpvblNvY2lhbCI6ImFzZCIsInRpcG9Vc3VhcmlvIjoiVXN1YXJpbyIsImN1aXQiOiIyNzkyNzUyNTQwOCIsImV4cCI6MTU3NDE0MTU0MywiaXNzIjoiaHR0cDovL3Nzby5ub3ZpdC5jb20uYXIiLCJhdWQiOiJodHRwOi8vc3NvLm5vdml0LmNvbS5hciJ9.2FM4pzo9xAwv_qDOEcNQILb8wPRfF1g8EdEQ0EoIEdw"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
