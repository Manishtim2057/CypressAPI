import { baseConfig } from "../../fixtures/baseConfig";
describe('Reorder the campaign theme layout', () => {
    let selectedResourceId;
    let selectedResourceId1;
    let selectedResourceId2;
    let layoutId;

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
        cy.log('Get Ids of Images From Available Images');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const layoutId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, layoutId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            layoutId = data.layoutId;
        });
    });

    it('Reorder Campaign layouts with invalid Api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/pages/${baseConfig.landingPageId}/layoutss/order`,
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
    it('Reorder Campaign layouts with valid Api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PATCH',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/order`,
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
    it('Reorder Campaign layouts with invalid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PATCH',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layoutss/order`,
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
    it('Reorder Campaign layouts with valid Api and valid Method.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

            const responseData = response.body.body.data;

            if (Array.isArray(responseData)) {
                const resourceIds = responseData.map((item) => item.id);
                const reorderedIds = [...resourceIds].sort();

                cy.log('Reordered IDs:', reorderedIds);

                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/order`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: {
                        ids: reorderedIds,
                    },
                    failOnStatusCode: false
                }).then((postResponse) => {
                    expect(postResponse.status).to.eql(200, 'Check for Success Status of PUT Request');
                    const actualIds = postResponse.body.body.data.map(item => item.id);
                    expect(actualIds).to.have.members(reorderedIds);
                    expect(actualIds).to.eql(reorderedIds);
                });
            } else {
                cy.log('Response data is not an array:', responseData);
            }
        });
    });

    it('Reorder Layouts with All read Permission', () => {
        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${siteReadAccessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

            const responseData = response.body.body.data;

            if (Array.isArray(responseData)) {
                const resourceIds = responseData.map((item) => item.id);
                const reorderedIds = [...resourceIds].sort();

                cy.log('Reordered IDs:', reorderedIds);

                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/order`,
                    headers: {
                        Authorization: `Bearer ${siteReadAccessToken}`,
                    },
                    body: {
                        ids: reorderedIds,
                    },
                    failOnStatusCode: false
                }).then((postResponse) => {
                    expect(postResponse.status).to.eql(403, 'Check for Success Status of PUT Request');
                    // const actualIds = postResponse.body.body.data.map(item => item.id);
                    // expect(actualIds).to.have.members(reorderedIds); 
                    // expect(actualIds).to.eql(reorderedIds);
                });
            } else {
                cy.log('Response data is not an array:', responseData);
            }
        });
    });
    it('Reorder Campaign layouts with MasterAdmin Permission', () => {
        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${masterAdminAccessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

            const responseData = response.body.body.data;

            if (Array.isArray(responseData)) {
                const resourceIds = responseData.map((item) => item.id);
                const reorderedIds = [...resourceIds].sort();

                cy.log('Reordered IDs:', reorderedIds);

                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/order`,
                    headers: {
                        Authorization: `Bearer ${masterAdminAccessToken}`,
                    },
                    body: {
                        ids: reorderedIds,
                    },
                    failOnStatusCode: false
                }).then((postResponse) => {
                    expect(postResponse.status).to.eql(200, 'Check for Success Status of PUT Request');
                    const actualIds = postResponse.body.body.data.map(item => item.id);
                    expect(actualIds).to.have.members(reorderedIds);
                    expect(actualIds).to.eql(reorderedIds);
                });
            } else {
                cy.log('Response data is not an array:', responseData);
            }
        });
    });
    it('Reorder Campaign layouts with Site admin Permission', () => {
        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${siteAdminAccessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

            const responseData = response.body.body.data;

            if (Array.isArray(responseData)) {
                const resourceIds = responseData.map((item) => item.id);
                const reorderedIds = [...resourceIds].sort();

                cy.log('Reordered IDs:', reorderedIds);

                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/order`,
                    headers: {
                        Authorization: `Bearer ${siteAdminAccessToken}`,
                    },
                    body: {
                        ids: reorderedIds,
                    },
                    failOnStatusCode: false
                }).then((postResponse) => {
                    expect(postResponse.status).to.eql(200, 'Check for Success Status of PUT Request');
                    const actualIds = postResponse.body.body.data.map(item => item.id);
                    expect(actualIds).to.have.members(reorderedIds);
                    expect(actualIds).to.eql(reorderedIds);
                });
            } else {
                cy.log('Response data is not an array:', responseData);
            }
        });
    });

    it('Reorder Campaign layouts with Reseller Admin Permission', () => {
        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${resellerAdminAccessToken}`,
            },
            qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

            const responseData = response.body.body.data;

            if (Array.isArray(responseData)) {
                const resourceIds = responseData.map((item) => item.id);
                const reorderedIds = [...resourceIds].sort();

                cy.log('Reordered IDs:', reorderedIds);

                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/layouts/order`,
                    headers: {
                        Authorization: `Bearer ${resellerAdminAccessToken}`,
                    },
                    body: {
                        ids: reorderedIds,
                    },
                    qs: {
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    failOnStatusCode: false
                }).then((postResponse) => {
                    expect(postResponse.status).to.eql(200, 'Check for Success Status of PUT Request');
                    const actualIds = postResponse.body.body.data.map(item => item.id);
                    expect(actualIds).to.have.members(reorderedIds);
                    expect(actualIds).to.eql(reorderedIds);
                });
            } else {
                cy.log('Response data is not an array:', responseData);
            }
        });
    });
});
