import { baseConfig } from "../../../fixtures/baseConfig";
let contactId;
let documentId;
let imageId;
let linkId;
let resellerResourceID;
let resellerResourceType;
let resellerVersion;
describe('Attach Homepage Resources.', () => {
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

        cy.log('Add the Site Contacts')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/contacts',
                body: {

                    "title": "Cypress Automation",
                    "description": "It is a description.",
                    "value": "manis@gmail.com ",
                    "type": 1,
                    "status": 2,
                    "thumbnail_url": null
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for validation error');
            });
        })

        cy.log('Get Ids of contacts from Available Contacts')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/available-contacts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const contactId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, contactId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });

        cy.log('Add the Site Documents')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/documents',
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pdfDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.pngImage,
                    "order": 8,
                    "status": 2,
                    "icon": "far fa-file-powerpoint"
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Documents');
            });
        });
        cy.log('Get Ids of Documents From Available Documents');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/available-documents`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const documentId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log('Add the Site link')
        cy.then(() => {

            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/links',
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum/.com",
                    "thumbnail_url": null,
                    "status": 2,
                    "open_in_external": true

                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
            });
        });

        cy.log('Get Ids of Links From Available Resources');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/available-links`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const linkId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });

        cy.log('Add the Site Images')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/images',
                body: {
                    "title": "Cypress Automation Images",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
                    "status": 1,
                    "icon": "far fa-file-images"
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');
            });

        })
        cy.log('Get Ids of Images From Available Resources');
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
            linkId = data.linkId;
            contactId = data.contactId;
            documentId = data.documentId;
            imageId = data.imageId;

        });
    });




    it('Attach Homepage Available Contacts with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resourcesss`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": contactId,
                "resource_type": "GlobalContact",
                "version_id": 0,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });


    it('Attach Homepage Available Contacts with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": contactId,
                "resource_type": "GlobalContact",
                "version_id": 0,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');
        });
    });
    it('Attach Homepage Available Contacts with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resourcessSS`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            }, body: {
                "resource_id": contactId,
                "resource_type": "GlobalContact",
                "version_id": 0,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('Attach Homepage Available Contacts with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": contactId,
                "resource_type": "GlobalContact",
                "version_id": 0,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

        });
    });

    it('Attach Homepage Available link with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": linkId,
                "resource_type": "GlobalLink",
                "version_id": 0,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

        });
    });

    it('Attach Homepage Available Resources with All read Permission', () => {

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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,
                },
                body: {
                    "resource_id": contactId,
                    "resource_type": "GlobalContact",
                    "version_id": 0,
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status of contacts');
            });
        });
    });


    it('Attach Homepage Available Global Document with MasterAdmin Permission', () => {

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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,
                },
                body: {
                    "resource_id": documentId,
                    "resource_type": "GlobalDocument",
                    "version_id": 0,
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of contacts');
            });
        });
    });

    it('Attach Homepage Available Global Image with Site Admin Permission', () => {

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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                body: {
                    "resource_id": imageId,
                    "resource_type": "GlobalImage",
                    "version_id": 0,
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of contacts');
            });
        });
    });

    it('Attach Homepage Available Resources with Global Resource CRUD Permission', () => {

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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                },
                body: {
                    "resource_id": contactId,
                    "resource_type": "GlobalContact",
                    "version_id": 0,
                    "order": 1
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status of contacts');

            });
        });
    });
    it('Attach Homepage Available Resources with Reseller Admin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.ResellerAdminPermission,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.log('Add the Site Documents on the Reseller Site')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');

            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents`,
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pdfDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.pngImage,
                    "order": 8,
                    "status": 2,
                    "icon": "far fa-file-powerpoint"
                },
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Documents');

            });
        });

        cy.log('Fetch the Available List from Document')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/available-documents`,
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
                const resellerResourceType = response.body.body.data[0].resource_type
                const resellerVersion = response.body.body.data[0].version_id
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
        cy.log('Attach the Homepage Resources.')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
                body: {
                    "resource_id": resellerResourceID,
                    "resource_type": "GlobalDocument",
                    "version_id": 0,
                    "order": 1
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Documents Attached');

            });
        });
    });
});