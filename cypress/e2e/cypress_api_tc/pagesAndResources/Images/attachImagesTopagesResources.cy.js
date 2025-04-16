import { baseConfig } from "../../../../fixtures/baseConfig";let imageId;
let resellerResourceID;
let resellerResourceType;
let resellerVersion;
describe('Attach Images on Pages and Resources.', () => {
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

        cy.log('Add the Site Imagess')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images`,
                method: 'POST',
                body:{
                    "title": "Cypress Automation Images",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
                    "status": 2,
                    "icon": "far fa-file-images"
               },
               headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Imagess');
            });
        });
        cy.log('Get Ids of Imagess From Available Imagess');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/available-images`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const imageId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, imageId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            imageId = data.imageId;
        });
    });




    it('Attach Page Images with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/imagesss/${imageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });


    it('Attach Page Images with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');
        });
    });
    it('Attach Page Images with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resourcessSS`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            }, body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('Attach Page Images with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${imageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
    });

    it('Attach Page Resources with All read Permission', () => {

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
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${imageId}`,
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,
                },
                body: {
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(403, 'Check for Success Status');
            });
        });
    });


    it('Attach Page Global Images with MasterAdmin Permission', () => {

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
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${imageId}`,
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,
                },
                body: {
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
            });
            
        });
    });

    it('Attach Page Global Image with Site Admin Permission', () => {

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
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${imageId}`,
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                body: {
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
            });
        });
    });

    it('Attach Page Resources with Global Resource CRUD Permission', () => {

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
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${imageId}`,
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                },
                body: {
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(403, 'Check for Success Status');
            });
        });
    });
    it('Attach Page Resources with Reseller Admin Permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.ResellerAdminPermission,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.log('Add the Site Imagess on the Reseller Site')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/images`,
                body:{
                    "title": "Cypress Automation Images",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
                    "status": 2,
                    "icon": "far fa-file-images"
               },
               headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Imagess');

            });
        });

        cy.log('Fetch the Available List from Images')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/available-images`,
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,

                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const resellerResourceID = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, resellerResourceID, resellerResourceType, resellerVersion };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                resellerResourceID = data.resellerResourceID;
                resellerResourceType = data.resellerResourceType;
                resellerVersion = data.resellerVersion;
        });
        });
        cy.log('Attach the Images To Pages and Resources.')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/images/${resellerResourceID}`,
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                body: {
                    "order": 1
                },
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
            });
        });
    });
});