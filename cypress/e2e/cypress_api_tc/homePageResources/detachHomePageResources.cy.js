import { baseConfig } from "../../../fixtures/baseConfig";
let selectedResourceId;
let resourceType;
let version_id;
let contactId;
let documentId;
let imageId;
let linkId;

describe('Detach Homepage Resources.', () => {
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
        cy.log('Attach the Contacts as Homepage resources')
        cy.then(() => {
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
        })
        cy.log('Attach the Link as Homepage resources.')
        cy.then(() => {
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
        cy.log('Attach the Document as Homepage resources.')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
        cy.log('Attach the Image as Homepage resources.')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
    beforeEach(() => {
        cy.log('Fetch list of Selected Homepage resources')
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
            expect(response.body.body.data[0]).to.have.property('id');
            const selectedResourceId = response.body.body.data[0].resource_id;
            const resourceType = response.body.body.data[0].resource_type;
            const version_id = response.body.body.data[0].version_id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, selectedResourceId, resourceType, version_id };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });

        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            selectedResourceId = data.selectedResourceId;
            resourceType = data.resourceType;
            version_id = data.version_id;

        });
    });


    it('Detach Homepage resources with invalid Api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resoursces`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": selectedResourceId,
                "resource_type": resourceType,
                "version_id": version_id
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
        });
    });
    it('Detach Homepage resources with valid Api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PATCH',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": selectedResourceId,
                "resource_type": resourceType,
                "version_id": version_id
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(405, 'Check for Success Status');

        });
    });
    it('Detach Homepage resources with invalid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PATCH',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resourcesss`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": selectedResourceId,
                "resource_type": resourceType,
                "version_id": version_id
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
        });
    });
    it('Detach Homepage resource with valid Api and valid Method.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": selectedResourceId,
                "resource_type": resourceType,
                "version_id": version_id
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

        });
    });
    it('Detach Homepage Resources with All read Permission', () => {

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
                method: 'DELETE',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,

                },
                body: {
                    "resource_id": selectedResourceId,
                    "resource_type": resourceType,
                    "version_id": version_id
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(403, 'Check for Success Status');

            });
        });
    });
    it('Detach Homepage Resources with MasterAdmin Permission', () => {
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
                method: 'DELETE',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,

                },
                body: {
                    "resource_id": selectedResourceId,
                    "resource_type": resourceType,
                    "version_id": version_id
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');

            });
        });
    });
    it('Detach Homepage Resources with Site admin Permission', () => {

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
                method: 'DELETE',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                body: {
                    "resource_id": selectedResourceId,
                    "resource_type": resourceType,
                    "version_id": version_id,

                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of contacts');
            });
        });

    });
    it('Detach Homepage Resources with Global CRUD Permission', () => {

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
                method: 'DELETE',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,

                },
                body: {
                    "resource_id": selectedResourceId,
                    "resource_type": resourceType,
                    "version_id": version_id
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(403, 'Check for Success Status');

            });
        });
    });

    it('Detach Homepage Resources with Reseller Admin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.ResellerAdminPermission,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.log('Fetch list of Selected Homepage resources')
        cy.then(()=>{
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
        cy.request({
            method: 'GET',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
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
            const selectedResourceId = response.body.body.data[0].resource_id;
            const resourceType = response.body.body.data[0].resource_type;
            const version_id = response.body.body.data[0].version_id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, selectedResourceId, resourceType, version_id };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        });
    });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            selectedResourceId = data.selectedResourceId;
            resourceType = data.resourceType;
            version_id = data.version_id;
        });
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'DELETE',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,

                },
                body: {
                    "resource_id": selectedResourceId,
                    "resource_type": resourceType,
                    "version_id": version_id
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');

            });
        });
    });
});
/*it('Detach All Homepage resources with valid API and valid method.', () => {
    const accessToken = Cypress.env('accessToken');

    cy.request({
        method: 'GET',
        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/available-contacts`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        failOnStatusCode: false,
    }).then((response) => {
        // Validate the response
        expect(response.status).to.eq(200);
        expect(response.body.body).to.have.property('data');

        const documents = response.body.body.data; // Get the list of documents

        // Loop through the documents and delete each
        documents.forEach((document) => {
            const documentId = document.id;
            const resourceType = document.resource_type; // Use correct variable name

            cy.request({
                method: 'DELETE',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "resource_id": documentId, // Use correct variable name
                    "resource_type": resourceType, // Use correct variable name
                    "version_id": 0
                },
                failOnStatusCode: false,
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eql(417); // Accept both success codes

                cy.log(`✅ Deleted resource with ID: ${documentId} and Type: ${resourceType}`);
            });
        });
    });
});*/
