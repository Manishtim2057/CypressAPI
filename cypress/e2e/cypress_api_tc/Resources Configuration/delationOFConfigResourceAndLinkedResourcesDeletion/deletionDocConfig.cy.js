// import { baseConfig } from "../../../fixtures/baseConfig";
// describe('View Usage of Link with Super admin permission', () => {
//     let linkId;

//     before('Login With super admin permission', () => {
//         cy.request({
//             url: baseConfig.authUrl,
//             method: "POST",
//             body: baseConfig.superadminPermissionBody,
//         }).then((response) => {
//             cy.log('Login Response', JSON.stringify(response));
//             expect(response.status).to.be.eql(200);
//             Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
//         });
//         cy.then('Login with Master Admin Permission',()=>{
//             cy.request({
//                 url: baseConfig.authUrl,
//                 method: "POST",
//                 body: baseConfig.masterPermissionBody,
//             }).then((response) => {
//                 cy.log('Login Response', JSON.stringify(response));
//                 expect(response.status).to.be.eql(200);
//                 Cypress.env('masterAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
//             });
//         })
//         cy.then('Login with Site admin permission',()=>{
//             cy.request({
//                 url: baseConfig.authUrl,
//                 method: "POST",
//                 body: baseConfig.SiteAdminPermission358,
//             }).then((response) => {
//                 cy.log('Login Response', JSON.stringify(response));
//                 expect(response.status).to.be.eql(200);
//                 Cypress.env('siteAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
//             });
//         });
//         cy.then('Login with Reseller Admin Permission',()=>{
//             cy.request({
//                 url: baseConfig.authUrl,
//                 method: "POST",
//                 body: baseConfig.ResellerAdminPermission,
//             }).then((response) => {
//                 cy.log('Login Response', JSON.stringify(response));
//                 expect(response.status).to.be.eql(200);
//                 Cypress.env('resellerAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
//             });
//         });
//         cy.then('Login with Site Read Permission',()=>{
//             cy.request({
//                 url: baseConfig.authUrl,
//                 method: "POST",
//                 body: baseConfig.siteReadPermissionBody,
//             }).then((response) => {
//                 cy.log('Login Response', JSON.stringify(response));
//                 expect(response.status).to.be.eql(200);
//                 Cypress.env('siteReadAccessToken', response.body.body.access_token); // Store token in Cypress.env
//             });
//         })
//     });
//     it('Create Global Doc',()=>{

//     })
//     });