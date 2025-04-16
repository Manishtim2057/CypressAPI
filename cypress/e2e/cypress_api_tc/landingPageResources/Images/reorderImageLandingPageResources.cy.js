import { baseConfig } from "../../../../fixtures/baseConfig";let selectedResourceId;
let selectedResourceId1;
let selectedResourceId2;
let documentId;
let resellerResourceID;
let resellerResourceID1;
let resellerResourceID2;
let resellerResourceType;
let resellerVersion;
describe('Reorder Image on Pages and Resources.', () => {
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

        cy.log('Add the Site Images')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images`,
                body:{
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
        });
        cy.log('Get Ids of Images From Available Images');
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
                const documentId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            documentId = data.documentId;
        });
    });

    it('Reorder Homepage resources with invalid Api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/imagesss/order`,
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
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/order`,
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
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/imagess/order`,
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
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images`,
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
                    url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/order`,
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
        cy.log('Get the Selected Resources')
        cy.then(() => {
            const accessTokenReadPermission = Cypress.env('accessTokenReadPermission');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images`,
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
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/order`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images`,
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
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/order`,
                        headers: {
                            Authorization: `Bearer ${accessTokenMasterAdmin}`,
                        },
                        failOnStatusCode: false,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images`,
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
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/order`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/order`,
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

        cy.log('Add the Site Images on the Reseller Site')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            let i;
            for (i = 0; i > 3; i++) {
                cy.request({
                    method: 'POST',
                    url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/images`,
                    body:{
                        "title": "Cypress Automation Images",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
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
                    expect(response.status).to.eql(200, 'Check for status of Image');

                });
            }
        });
        cy.log('Fetch the Available List from Image')
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
                const resellerResourceID1 = response.body.body.data[1].id;
                const resellerResourceID2 = response.body.body.data[2].id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, resellerResourceID, resellerResourceID1, resellerResourceID2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                resellerResourceID = data.resellerResourceID;
                resellerResourceID1 = data.resellerResourceID1;
                resellerResourceID2 = data.resellerResourceID2;
            });
        });

        cy.log('Attach the Page Resources.')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/images/${resellerResourceID1}`,
                body: {
                    "order": 2
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
                expect(response.status).to.eql(200, 'Check for status of Images Attached');

            });
        });

        cy.log('Attach the Page Resources1.')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/images/${resellerResourceID}`,
                body: {
                    "order": 3
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
                expect(response.status).to.eql(200, 'Check for status of Images Attached');

            });
        });
        cy.log('Attach the Page Resources2.')
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/images/${resellerResourceID2}`,
                body: {
                    "order": 4
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
                expect(response.status).to.eql(200, 'Check for status of Images Attached');

            });
        });
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'GET',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/images`,
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
                        url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/images/order`,
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
                        cy.log(postResponse);
                        // Further assertions or actions on the POST response if needed
                    });
                } else {
                    cy.log('Response data is not an array:', responseData);
                }
            });
        });
    });
});
