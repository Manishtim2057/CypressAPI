import { baseConfig } from "../../../fixtures/baseConfig";
 let selectedResourceId;
let selectedResourceId1;
let selectedResourceId2;
let contactId;
let documentId;
let imageId;
let linkId;
let resellerResourceID;
let resellerResourceType;
let resellerVersion;

describe('Reorder Homepage Resources.', () => {
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
        cy.log('Fetch list of Attached Homepage resources')
        cy.then(() => {
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
                const selectedResourceId = response.body.body.data[0].id;
                const selectedResourceId1 = response.body.body.data[1].id;
                const selectedResourceId2 = response.body.body.data[2].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, selectedResourceId, selectedResourceId1, selectedResourceId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })

        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            selectedResourceId = data.selectedResourceId;
            selectedResourceId1 = data.selectedResourceId1;
            selectedResourceId2 = data.selectedResourceId2;
        });
    });
    it('Reorder Homepage resources with invalid Api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resoursces`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "ids": [
                    selectedResourceId, selectedResourceId2, selectedResourceId1
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
        });
    });
    it('Reorder Homepage resources with valid Api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PATCH',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/order`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "ids": [
                    selectedResourceId, selectedResourceId2, selectedResourceId1
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(405, 'Check for Success Status');

        });
    });
    it('Reorder Homepage resources with invalid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PATCH',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/orderss`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "ids": [
                    selectedResourceId, selectedResourceId2, selectedResourceId1
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
        });
    });
    it('Reorder Homepage resource with valid Api and valid Method.', () => {
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

            // Extract data array from the response
            const responseData = response.body.body.data;  // Accessing the data array

            // Ensure responseData is an array
            if (Array.isArray(responseData)) {
                // Extract resource IDs from the data array
                const resourceIds = responseData.map((item) => item.id);

                // Reorder the IDs (e.g., sort in ascending order)
                const reorderedIds = resourceIds.sort();

                // Log the reordered IDs for verification
                cy.log('Reordered IDs:', reorderedIds);

                // Send the reordered IDs in another API request
                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/order`,  // Replace with actual endpoint
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: {
                        ids: reorderedIds, // Send reordered IDs as part of the request body
                    },
                }).then((postResponse) => {
                    expect(postResponse.status).to.eql(200, 'Check for Success Status of POST Request');
                    // Further assertions or actions on the POST response if needed
                });
            } else {
                cy.log('Response data is not an array:', responseData);
            }
        });
    });
    it('Reorder Homepage Resources with All read Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.siteReadPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenReadPermission', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenReadPermission = Cypress.env('accessTokenReadPermission');

            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');

                // Extract data array from the response
                const responseData = response.body.body.data;  // Accessing the data array

                // Ensure responseData is an array
                if (Array.isArray(responseData)) {
                    // Extract resource IDs from the data array
                    const resourceIds = responseData.map((item) => item.id);

                    // Reorder the IDs (e.g., sort in ascending order)
                    const reorderedIds = resourceIds.sort();

                    // Log the reordered IDs for verification
                    cy.log('Reordered IDs:', reorderedIds);

                    // Send the reordered IDs in another API request
                    cy.request({
                        method: 'PUT',
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/order`,  // Replace with actual endpoint
                        headers: {
                            Authorization: `Bearer ${accessTokenReadPermission}`,
                        },
                        body: {
                            ids: reorderedIds, // Send reordered IDs as part of the request body
                        },
                        failOnStatusCode: false
                    }).then((postResponse) => {
                        expect(postResponse.status).to.eql(403, 'Check for Success Status of POST Request');
                        // Further assertions or actions on the POST response if needed
                    });
                } else {
                    cy.log('Response data is not an array:', responseData);
                }
            });
        });

    });
    it('Reorder Homepage Resources with MasterAdmin Permission', () => {
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');

                // Extract data array from the response
                const responseData = response.body.body.data;  // Accessing the data array

                // Ensure responseData is an array
                if (Array.isArray(responseData)) {
                    // Extract resource IDs from the data array
                    const resourceIds = responseData.map((item) => item.id);

                    // Reorder the IDs (e.g., sort in ascending order)
                    const reorderedIds = resourceIds.sort();

                    // Log the reordered IDs for verification
                    cy.log('Reordered IDs:', reorderedIds);

                    // Send the reordered IDs in another API request
                    cy.request({
                        method: 'PUT',
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/order`,  // Replace with actual endpoint
                        headers: {
                            Authorization: `Bearer ${accessTokenMasterAdmin}`,
                        },
                        body: {
                            ids: reorderedIds, // Send reordered IDs as part of the request body
                        },
                    }).then((postResponse) => {
                        expect(postResponse.status).to.eql(200, 'Check for Success Status of POST Request');
                        // Further assertions or actions on the POST response if needed
                    });
                } else {
                    cy.log('Response data is not an array:', responseData);
                }
            });
        });
    });
    it('Reorder Homepage Resources with Site admin Permission', () => {

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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');

                // Extract data array from the response
                const responseData = response.body.body.data;  // Accessing the data array

                // Ensure responseData is an array
                if (Array.isArray(responseData)) {
                    // Extract resource IDs from the data array
                    const resourceIds = responseData.map((item) => item.id);

                    // Reorder the IDs (e.g., sort in ascending order)
                    const reorderedIds = resourceIds.sort();

                    // Log the reordered IDs for verification
                    cy.log('Reordered IDs:', reorderedIds);

                    // Send the reordered IDs in another API request
                    cy.request({
                        method: 'PUT',
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/order`,  // Replace with actual endpoint
                        headers: {
                            Authorization: `Bearer ${accessTokenSiteAdmin}`,
                        },
                        body: {
                            ids: reorderedIds, // Send reordered IDs as part of the request body
                        },
                    }).then((postResponse) => {
                        expect(postResponse.status).to.eql(200, 'Check for Success Status of POST Request');
                        // Further assertions or actions on the POST response if needed
                    });
                } else {
                    cy.log('Response data is not an array:', responseData);
                }
            });
        });

    });
    it('Reorder Homepage Resources with Global CRUD Permission', () => {

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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources/order`,  // Replace with actual endpoint
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                },
                body: {
                    ids: 111,
                },
                failOnStatusCode: false

            }).then((response) => {
                expect(response.status).to.eql(403, 'Check for Success Status of POST Request');
            });
        });
    });

    it('Reorder Homepage Resources with Reseller Admin Permission', () => {
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


        cy.then(() => {
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

                // Extract data array from the response
                const responseData = response.body.body.data;  // Accessing the data array

                // Ensure responseData is an array
                if (Array.isArray(responseData)) {
                    // Extract resource IDs from the data array
                    const resourceIds = responseData.map((item) => item.id);

                    // Reorder the IDs (e.g., sort in ascending order)
                    const reorderedIds = resourceIds.sort();

                    // Log the reordered IDs for verification
                    cy.log('Reordered IDs:', reorderedIds);

                    // Send the reordered IDs in another API request
                    cy.request({
                        method: 'PUT',
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources/order`,  // Replace with actual endpoint
                        headers: {
                            Authorization: `Bearer ${accessTokenResellerAdmin}`,
                        },
                        body: {
                            ids: reorderedIds, // Send reordered IDs as part of the request body
                        },
                        qs: {
                            domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                        },
                        failOnStatusCode: false,
                    }).then((postResponse) => {
                        expect(postResponse.status).to.eql(200, 'Check for Success Status of POST Request');
                        // Further assertions or actions on the POST response if needed
                    });
                } else {
                    cy.log('Response data is not an array:', responseData);
                }
            });
        });
    });
});

