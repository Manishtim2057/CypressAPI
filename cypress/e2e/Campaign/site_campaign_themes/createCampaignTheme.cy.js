import { baseConfig } from "../../fixtures/baseConfig";


describe('Create Campaign Theme', () => {
    let generateRandomString;
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

    it('Create Campaign theme with invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themess`,
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

    it('Create Campaign theme with invalid api and invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themess`,
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

    it('Create Campaign theme with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
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
    it('Create Campaign theme with valid api and valid method with super admin permission.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
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
            expect(response.body.body.title).to.eql('Campaign_theme');
            expect(response.body.body.name).to.eql(randomName);
            expect(response.body.body.url).to.eql('http://lyb-v2-laravel.test/storage/themes/fLA2dNhB');
        })
    });
    it('Create Campaign theme with empty', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.title).to.eql([
                "The title field is required."
            ]);

        })
    });
    it('Create Campaign theme title with upperlimit+1.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut duis.",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.title).to.eql([
                "The title may not be greater than 60 characters."
            ]);

        })
    });
    it('Create Campaign theme name with upperlimit+1.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign Theme Test",
                name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut duis.",
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.name).to.eql([
                "The name may not be greater than 60 characters."
            ]);
        })
    });
    it('Create Campaign theme name with empty.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign Theme Test",
                name: "",
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.name).to.eql([
                "The name field is required."
            ]);
        })
    });
    it('Create Campaign theme name as integer.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign Theme Test",
                name: 1,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.name).to.eql([
                "The name must be a string."
            ]);
        })
    });
    it('Create Campaign theme url as empty.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign Theme Test",
                name: randomName,
                url: ""
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.url).to.eql([
                "The url field is required."
            ]);
        })
    });

    it('Create Campaign theme url as empty.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign Theme Test",
                name: randomName,
                url: "/storage/themes/fLA2dNhB"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.url).to.eql([
                "The url format is invalid."
            ]);
        })
    });
    it('Create Campaign theme url as integer.', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign Theme Test",
                name: randomName,
                url: 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Success Message');
            expect(response.body.body.url).to.eql([
                "The url must be a string.",
                "The url format is invalid."]);
        })
    });
    it('Create Campaign theme with valid api and valid method with master admin permission.', () => {

        const masterAdminAccessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
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
            expect(response.body.body.title).to.eql('Campaign_theme');
            expect(response.body.body.name).to.eql(randomName);
            expect(response.body.body.url).to.eql('http://lyb-v2-laravel.test/storage/themes/fLA2dNhB');
        })
    });
    it('Create Campaign theme with valid api and valid method with site admin permission.', () => {

        const siteAdminAccessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
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
            expect(response.body.body.title).to.eql('Campaign_theme');
            expect(response.body.body.name).to.eql(randomName);
            expect(response.body.body.url).to.eql('http://lyb-v2-laravel.test/storage/themes/fLA2dNhB');


        })
    });
    it('Create Campaign theme with valid api and valid method with reseller admin permission.', () => {

        const resellerAdminAccessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes`,
            headers: {
                Authorization: `Bearer ${resellerAdminAccessToken}`,
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
            expect(response.body.body.title).to.eql('Campaign_theme');
            expect(response.body.body.name).to.eql(randomName);
            expect(response.body.body.url).to.eql('http://lyb-v2-laravel.test/storage/themes/fLA2dNhB');

        })
    });


    it('Create Campaign theme with valid api and valid method with site read admin permission.', () => {

        const siteAdminAccessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
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
            expect(response.body.body.title).to.eql('Campaign_theme');
            expect(response.body.body.name).to.eql(randomName);
            expect(response.body.body.url).to.eql('http://lyb-v2-laravel.test/storage/themes/fLA2dNhB');


        })
    });

});