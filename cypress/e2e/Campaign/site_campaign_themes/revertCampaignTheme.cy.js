import { baseConfig } from "../../fixtures/baseConfig";


describe('DELETE Campaign Theme', () => {
    let campaignThemeId;
    let updatedThemeId;
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
    });

    it('Revert Campaign theme with invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themess/${campaignThemeId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }, body: {

                "title": "Campaign_theme",
                "name": "Test campaign Theme",
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"

            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        })
    });

    it('Revert Campaign theme with invalid api and invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themess/${campaignThemeId}/revert`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }, body: {

                "title": "Campaign_theme",
                "name": "Test campaign Theme",
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"

            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        })
    });

    it('Revert Campaign theme with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}/revert`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {

                "title": "Campaign_theme",
                "name": "Test campaign Theme",
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"

            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        })
    });

    it('Revert Campaign theme with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        const updatedRandomName = Array.from({ length: 42 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign_theme",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');
            expect(response.body.body).to.have.property('id');
            const campaignThemeId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, campaignThemeId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        });
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            campaignThemeId = data.campaignThemeId
        })
        cy.then('Update the Campaign Theme and Get ID', () => {
           
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    title: "Updated Campaign Theme",
                    name: updatedRandomName,
                    "url": "http://lyb-v2-laravel.test/stsdsdaorage/themes/fLA2dNhB"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Message');
                expect(response.body.body).to.have.property('id');
                const updatedThemeId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, updatedThemeId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
            cy.log('Read the variables')
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                updatedThemeId = data.updatedThemeId

            });

            cy.then('Revert campaign theme with master admin permission', () => {
                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${updatedThemeId}/revert`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                   
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for Success Message');
                })
            });
        })
    })

    it('Revert Campaign theme with MasterAdmin permission', () => {
        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        const updatedRandomName = Array.from({ length: 42 }, () => Math.random().toString(36)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${masterAdminAccessToken}`,
            },
            body: {
                title: "Campaign_theme",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');
            expect(response.body.body).to.have.property('id');
            const campaignThemeId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, campaignThemeId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        })
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            campaignThemeId = data.campaignThemeId

        });
        cy.then('Update the Campaign Theme and Get ID', () => {

            const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}`,
                headers: {
                    Authorization: `Bearer ${masterAdminAccessToken}`,
                },
                body: {
                    title: "Updated Campaign Theme",
                    name: updatedRandomName,
                    "url": "http://lyb-v2-laravel.test/stsdsdaorage/themes/fLA2dNhB"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Message');
                expect(response.body.body).to.have.property('id');
                const updatedThemeId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, updatedThemeId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
            cy.log('Read the variables')
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                updatedThemeId = data.updatedThemeId

            });

            cy.then('Revert campaign theme with master admin permission', () => {
                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${updatedThemeId}/revert`,
                    headers: {
                        Authorization: `Bearer ${masterAdminAccessToken}`,
                    },
                   
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for Success Message');
                })
            });
        })
    })

    it('Revert Campaign theme with Site Admin permission', () => {
        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        const updatedRandomName = Array.from({ length: 42 }, () => Math.random().toString(36)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${siteAdminAccessToken}`,
            },
            body: {
                title: "Campaign_theme",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');
            expect(response.body.body).to.have.property('id');
            const campaignThemeId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, campaignThemeId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        })
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            campaignThemeId = data.campaignThemeId

        });
        cy.then('Update the Campaign Theme and Get ID', () => {

            const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}`,
                headers: {
                    Authorization: `Bearer ${siteAdminAccessToken}`,
                },
                body: {
                    title: "Updated Campaign Theme",
                    name: updatedRandomName,
                    "url": "http://lyb-v2-laravel.test/stsdsdaorage/themes/fLA2dNhB"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Message');
                expect(response.body.body).to.have.property('id');
                const updatedThemeId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, updatedThemeId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
            cy.log('Read the variables')
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                updatedThemeId = data.updatedThemeId

            });

            cy.then('Revert campaign theme with master admin permission', () => {
                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${updatedThemeId}/revert`,
                    headers: {
                        Authorization: `Bearer ${siteAdminAccessToken}`,
                    },
                 
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for Success Message');
                })
            });
        })
    })

    it('Revert Campaign theme with Reseller Admin permission', () => {
        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        const updatedRandomName = Array.from({ length: 42 }, () => Math.random().toString(36)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${resellerAdminAccessToken}`,
            },
            body: {
                title: "Campaign_theme",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');
            expect(response.body.body).to.have.property('id');
            const campaignThemeId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, campaignThemeId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        })
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            campaignThemeId = data.campaignThemeId

        });
        cy.then('Update the Campaign Theme and Get ID', () => {

            const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaign-themes/${campaignThemeId}`,
                headers: {
                    Authorization: `Bearer ${resellerAdminAccessToken}`,
                },
                body: {
                    title: "Updated Campaign Theme",
                    name: updatedRandomName,
                    "url": "http://lyb-v2-laravel.test/stsdsdaorage/themes/fLA2dNhB"
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Message');
                expect(response.body.body).to.have.property('id');
                const updatedThemeId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, updatedThemeId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
            cy.log('Read the variables')
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                updatedThemeId = data.updatedThemeId

            });

            cy.then('Revert campaign theme with Reseller admin permission', () => {
                cy.request({
                    method: 'PUT',
                    url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaign-themes/${updatedThemeId}/revert`,
                    headers: {
                        Authorization: `Bearer ${resellerAdminAccessToken}`,
                    },
                    qs: {
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for Success Message');
                })
            });
        })
    })
});  