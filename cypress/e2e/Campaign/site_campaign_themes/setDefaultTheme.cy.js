import { baseConfig } from "../../../fixtures/baseConfig";
describe("Set Campaign Theme as Default", () => {
    let campaignThemeId;
    let campaignThemeId2;
    let resellerCampaignThemeId;
    let layoutName;
    let updatedThemeVersion2;

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
        cy.then('Create the Site Campaign Theme', () => {
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
                expect(response.body.body).to.have.property('id');
                const campaignThemeId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, campaignThemeId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
        })

        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            campaignThemeId = data.campaignThemeId

        });
        // cy.then('Update and Get the Layout Name', () => {
        //     const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        //     const accessToken = Cypress.env('accessToken');
        //     cy.request({
        //         method: 'PUT',
        //         url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}`,
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`,
        //         },
        //         body: {
        //             title: "Campaign_themesss",
        //             name: randomName,
        //             "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhBDDS"
        //         },
        //         failOnStatusCode: false,
        //     }).then((response) => {
        //         cy.log('Sites Response:', JSON.stringify(response));
        //         expect(response.status).to.eql(200, 'Check for Success Message');
        //         expect(response.body.body).to.have.property('name');
        //         const layoutName = response.body.body.name;
        //         const updatedThemeVersion2 = response.body.body.id;
        //         cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
        //             const updatedData = { ...data, layoutName, updatedThemeVersion2 };
        //             cy.writeFile('cypress\\fixtures\\variables.json', updatedData);
        //         })
        //     })
        //     cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
        //         layoutName = data.layoutName
        //         updatedThemeVersion2 = data.updatedThemeVersion2

        //     });
        // })

    })



    it('Set Default theme with valid API and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(405);
            expect(response.body.status.message).to.eql('Invalid method call.');
        })
    })
    it('Set Default theme with Invalid API and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themess/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.');
        })
    })
    it('Set Default theme with Invalid API and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themess/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.');
        })
    })
    it('Set Default theme with Valid API and Valid method with superadmin permission', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        })
    })

    it('Set Default theme with Valid API and Valid method with Masteradmin permission', () => {
        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${masterAdminAccessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        })
    })

    it('Set Default theme with Valid API and Valid method with Site admin permission', () => {
        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${siteAdminAccessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        })
    })
    it('Set Default theme with Valid API and Valid method with Site read permission', () => {
        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}/default`,
            headers: {
                Authorization: `Bearer ${siteReadAccessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(403);
        })
    })
    it('Set Default theme with Valid API and Valid method with Reseller Admin permission', () => {
        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');

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
            expect(response.body.body.title).to.eql('Campaign_theme');
            expect(response.body.body.name).to.eql(randomName);
            expect(response.body.body.url).to.eql('http://lyb-v2-laravel.test/storage/themes/fLA2dNhB');
            const resellerCampaignThemeId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, resellerCampaignThemeId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
        })
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            resellerCampaignThemeId = data.resellerCampaignThemeId



        })
        cy.then('Set Reseller Campaign theme Default', () => {
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaign-themes/${resellerCampaignThemeId}/default`,
                headers: {
                    Authorization: `Bearer ${resellerAdminAccessToken}`
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Site Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
            })
        })
    })
    it('Create campaign and Check the that default layout has been set.', () => {
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign_themesss",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhBDDS"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');
            expect(response.body.body).to.have.property('name');
            const layoutName = response.body.body.name;
            const updatedThemeVersion2 = response.body.body.id;
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                const updatedData = { ...data, layoutName, updatedThemeVersion2 };
                cy.writeFile('cypress\\fixtures\\variables.json', updatedData);
            })
        })
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            layoutName = data.layoutName
            updatedThemeVersion2 = data.updatedThemeVersion2

        });
        cy.then('Create Campaign', () => {
            const randomName = Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('');
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: {

                    "title": "Sample Test 11",
                    "slug": randomName,
                    "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                    "header": "string",
                    "footer": "string",
                    "start_date": "2026-04-18 00:00:00",
                    "end_date": "2026-07-18 00:00:00"

                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Site Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.layout).to.eql(layoutName);
            })
        })
    })
    it('Revert the updated campaign theme (Revised version should set as default)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${updatedThemeVersion2}/revert`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.is_default).to.eql(true);
        })
    })
    it('Once other created theme sets as default then, last theme Should be removed from default.)', () => {
        const accessToken = Cypress.env('accessToken');
        const randomName = Array.from({ length: 60 }, () => Math.random().toString(36)[2]).join('');
        cy.then('Create the campaign theme', () => {
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
                expect(response.body.body).to.have.property('id');
                const campaignThemeId2 = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, campaignThemeId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            })
        })
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            campaignThemeId2 = data.campaignThemeId2

        });
        cy.then('Set Reseller Campaign theme Default', () => {
            cy.request({
                method: 'PUT',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId2}/default`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Site Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
            })
        })
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaign-themes/${campaignThemeId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                title: "Campaign_themesss",
                name: randomName,
                "url": "http://lyb-v2-laravel.test/storage/themes/fLA2dNhBDDS"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Message');
            expect(response.body.body).to.have.property('name');
            expect(response.body.body.is_default).to.eql(false);
        })
    })


})


