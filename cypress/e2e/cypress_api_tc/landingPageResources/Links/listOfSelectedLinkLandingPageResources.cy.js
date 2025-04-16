import { baseConfig } from "../../../../fixtures/baseConfig";describe('Get Page Resources.', () => {
    before(() => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: {
                "username": "superuser@learnyourbenefits.com",
                "password": "lyb@20!9"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
        });
    });

    it('Get Page Resources with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pagesss/${baseConfig.sitePageId}/links`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');        }); 
    });


    it('Get Page Resources with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/links`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(405, 'Check for Success Status');
        }); 
    });
    it('Get Page Resources with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pagesss/${baseConfig.landingPageId}/links`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('Get Page Resources with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/links`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
           
        });
    });

    it('Get Page Resources with All read Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: {
                "username": "samundra@mail.com",
                "password": "1!passworD"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenReadPermission', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenReadPermission = Cypress.env('accessTokenReadPermission');
        cy.request({
            method: 'GET',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/links`,
            headers: {
                Authorization: `Bearer ${accessTokenReadPermission}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of links');
            });
        });
    });


    it('Get Page Resources with MasterAdmin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.masterPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenMasterAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenMasterAdmin = Cypress.env('accessTokenMasterAdmin');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/links`,
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of links');
            });
        });
    });

    it('Get Page Resources with Site Admin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.SiteAdminPermission358,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenSiteAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenSiteAdmin = Cypress.env('accessTokenSiteAdmin');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/links`,
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of links');
            });
        });
    });

    it('Get Page Resources with Global Resource CRUD Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.GlobalResourceCRUD,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenGlobalResourceCRUD', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenGlobalResourceCRUD = Cypress.env('accessTokenGlobalResourceCRUD');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/links`,
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status of links');

            });
        });
    });
    it('Get Page Resources with Reseller Admin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.ResellerAdminPermission,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links`,
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of links');

            });
        });
    });
});