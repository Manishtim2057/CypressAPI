import { baseConfig } from "../../../fixtures/baseConfig";
describe('Campaign Theme list', () => {
    let layoutName;
    let resellerLayoutName;
    before(() => {
        cy.request({
            method: 'POST',
            url: 'https://lyb-v2-laravel.test/api/auth/authenticate',
            body: {
                "username": "superuser@learnyourbenefits.com",
                "password": "lyb@20!9"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
        });
        cy.then('Login with Master Admin Permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.masterPermissionBody,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('masterAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        })
        cy.then('Login with Site admin permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.SiteAdminPermission358,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('siteAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        });
        cy.then('Login with Reseller Admin Permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.ResellerAdminPermission,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('resellerAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        });
        cy.then('Login with Site Read Permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.siteReadPermissionBody,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('siteReadAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        })

        cy.then('Store the Layout Name', () => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'GET',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success error');
                expect(response.body).to.have.property('body');
                expect(response.body.body).to.have.property('data');
                expect(response.body.body.data[0]).to.have.property('name');
                const layoutName = response.body.body.data[0].name;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, layoutName };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
        })
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            layoutName = data.layoutName

        });
    });
    it('Apply Campaign theme with invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themess/apply`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        })
    });

    it('Apply Campaign theme with invalid api and invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themess/apply`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        })
    });

    it('Apply Campaign theme with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themes/apply`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "layout": layoutName
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        })
    });
    it('Apply Campaign theme with valid api and valid method with super admin permission.', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themes/apply`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "layout": layoutName
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');


        })
    });
    it('Apply Campaign theme with valid api and valid method with master admin permission.', () => {

        const masterAdminAccessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themes/apply`,
            headers: {
                Authorization: `Bearer ${masterAdminAccessToken}`,
            },
            body: {
                "layout": layoutName
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');


        })
    });
    it('Apply Campaign theme with valid api and valid method with site admin permission.', () => {

        const siteAdminAccessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themes/apply`,
            headers: {
                Authorization: `Bearer ${siteAdminAccessToken}`,
            },
            body: {
                "layout": layoutName
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');


        })
    });
    it('Apply Campaign theme with valid api and valid method with reseller admin permission.', () => {

        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/themes`,
            headers: {
                Authorization: `Bearer ${resellerAdminAccessToken}`,
            },
            qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success error');
            expect(response.body).to.have.property('body');
            expect(response.body.body).to.have.property('data');
            expect(response.body.body.data[0]).to.have.property('name');
             resellerLayoutName = response.body.body.data[0].name;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, resellerLayoutName };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
            cy.log('Read the variables')
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                resellerLayoutName = data.resellerLayoutName
    
            });
        });
        cy.then('Apply the Theme', () => {
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/themes/apply`,
                headers: {
                    Authorization: `Bearer ${resellerAdminAccessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                body: {
                    "layout": resellerLayoutName
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Message');
            })
        })
    });

    it('Apply Campaign theme with valid api and valid method with site read admin permission.', () => {
        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/themes/apply`,
            headers: {
                Authorization: `Bearer ${siteReadAccessToken}`,
            },
            body: {
                "layout": layoutName
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(403, 'Check for Not found error');
        })
    });

});
