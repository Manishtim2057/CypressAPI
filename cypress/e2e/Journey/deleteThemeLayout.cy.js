import { baseConfig } from "../../fixtures/baseConfig";

describe('Campaign Theme Layout list', () => {
    let configuredLandingPageTheme;
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
        cy.then('', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "title": "Header",
                    "content": [{
                        "This is the Header of the Journey": {
                            "resource_id": 1,
                            "resource_type": "GlobalDocument",
                            "resources": {

                            }
                        }
                    }],
                    "order": 1,
                    "children": [{
                        "title": "Pop-up",
                        "content":
                            [{
                                "This is Pop-up Content": {
                                    "resource_id": 1,
                                    "resource_type": "GlobalDocument",
                                    "resources": {

                                    }
                                }
                            }],
                        "order": 1
                    }
                    ]
                }
                ,
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Not found error');
                expect(response.body.body).to.have.property('id');
                const configuredLandingPageTheme = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, configuredLandingPageTheme };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            })
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredLandingPageTheme = data.configuredLandingPageTheme

        });
    });

    it('Delete Campaign Layout with invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layoutss/${configuredLandingPageTheme}`,
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
    it('Delete Campaign Layout with valid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/${configuredLandingPageTheme}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Invalid method error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        })
    });
    it('Delete Campaign Layout with invalid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layoutss/${configuredLandingPageTheme}`,
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
    it('Delete Campaign Layout with valid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/${configuredLandingPageTheme}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success');
        })
    });

    it('Delete Campaign layout with Site admin permission', () => {
        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${siteAdminAccessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');
            expect(response.body.body).to.have.property('id');
            const configuredLandingPageTheme = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredLandingPageTheme };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });

        })

        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredLandingPageTheme = data.configuredLandingPageTheme

        });

        cy.then('Delete the Layout', () => {
            const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');

            cy.request({
                method: 'DELETE',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/${configuredLandingPageTheme}`,
                headers: {
                    Authorization: `Bearer ${siteAdminAccessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success');
            })
        });
    });
    it('Delete Campaign layout with Master admin permission', () => {
        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${masterAdminAccessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');
            expect(response.body.body).to.have.property('id');
            const configuredLandingPageTheme = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredLandingPageTheme };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });

        })

        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredLandingPageTheme = data.configuredLandingPageTheme

        });

        cy.then('Delete the Layout', () => {
            const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');

            cy.request({
                method: 'DELETE',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts/${configuredLandingPageTheme}`,
                headers: {
                    Authorization: `Bearer ${masterAdminAccessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success');
            })
        });
    });
    it('Delete Campaign layout with Reseller admin permission', () => {
        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${resellerAdminAccessToken}`,
            },
            qs: {
             domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');
            expect(response.body.body).to.have.property('id');
            const configuredLandingPageTheme = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredLandingPageTheme };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });

        })

        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredLandingPageTheme = data.configuredLandingPageTheme

        });

        cy.then('Delete the Layout', () => {
            const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');

            cy.request({
                method: 'DELETE',
                url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/layouts/${configuredLandingPageTheme}`,
                headers: {
                    Authorization: `Bearer ${resellerAdminAccessToken}`,
                },
                qs: {
             domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success');
            })
        });
    });

    it('Delete Theme Layout with Site read permission',()=>{
        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/layouts/${configuredLandingPageTheme}`,
            headers: {
                Authorization: `Bearer ${siteReadAccessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(403, 'Check for Unauthorized Access');
        })
    })
})


