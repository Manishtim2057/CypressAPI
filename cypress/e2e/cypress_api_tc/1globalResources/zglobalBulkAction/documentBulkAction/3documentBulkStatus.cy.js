import { baseConfig } from "../../../../../fixtures/baseConfig";
let documentId1;
let documentId2;
describe('Change Status of Document', () => {

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
        cy.log('Get ids of Document');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/documents',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const documentId1 = response.body.body.data[0].id;
                const documentId2 = response.body.body.data[1].id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId1, documentId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            documentId1 = data.documentId1
            documentId2 = data.documentId2
        });
    });
    it('Change the status of Contact with valid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/documents/multiple/status',
            body: {
                "ids": [
                    documentId1, documentId2
                ],
                "status": 1
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for invalid method Error');
            
        });
    });


    it('Change the status of Contact with Invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple/statussss',
            body: {
                "ids": [
                    documentId1, documentId2
                ],
                "status": 1
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });


    it('Change the status of Contact with Invalid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/documents/multiple/statusss',
            body: {
                "ids": [
                    documentId1, documentId2
                ],
                "status": 1
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('change the status of Contact with valid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple/status',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "ids": [
                    documentId1, documentId2
                ],
                "status": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
        });
    });

    it('Edit  Image with document with All read Permission', () => {
    
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
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/documents/multiple/status',
                    body: {
                    "ids": [
                        documentId1, documentId2
                    ],
                    "status": 1
                },
                    headers: {
                        Authorization: `Bearer ${accessTokenReadPermission}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(403, 'Check for status of Images');
                    expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");
                });
            });
        });
    
    
        it('Edit  Image with document with MasterAdmin Permission', () => {
    
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
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/documents/multiple/status',
                    body: {
                    "ids": [
                        documentId1, documentId2
                    ],
                    "status": 1
                },
                    headers: {
                        Authorization: `Bearer ${accessTokenMasterAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of Images');
                });
            });
        });
    
        it('Edit  Image with document with Site Admin Permission', () => {
    
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
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/documents/multiple/status',
                    body: {
                    "ids": [
                        documentId1, documentId2
                    ],
                    "status": 1
                },
                    headers: {
                        Authorization: `Bearer ${accessTokenSiteAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(403, 'Check for status of Images');
                    expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");
    
                });
            });
        });
    
        it('Edit  Image with document with Global Resource CRUD Permission', () => {
    
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
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/documents/multiple/status',
                    body: {
                    "ids": [
                        documentId1, documentId2
                    ],
                    "status": 1
                },
                    headers: {
                        Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of Images');
    
                });
            });
            it('Edit  Image with document with Reseller Admin Permission', () => {
    
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
                    url: baseConfig.baseUrl + '/documents',
                    qs:{
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenResellerAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eql(200, 'Check for Success Status');
                    expect(response.body.body.data[0]).to.have.property('id');
                    const resellerImage1 = response.body.body.data[0].id;
                    const resellerImage2 = response.body.body.data[1].id;
    
                    cy.readFile('cypress/fixtures/variables.json').then((data) => {
                        const updatedData = { ...data, documentId1, documentId2 };
                        cy.writeFile('cypress/fixtures/variables.json', updatedData);
                    });
                });
            });
                cy.log("Read The variables")
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    resellerImage1 = data.resellerImage1
                    resellerImage2 = data.resellerImage2
                });
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/documents/multiple/status',
                    body: {
                    "ids": [
                        documentId1, documentId2
                    ],
                    "status": 1
                },
                    qs:{
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenResellerAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of Images');
    
                });
            });
        });
});