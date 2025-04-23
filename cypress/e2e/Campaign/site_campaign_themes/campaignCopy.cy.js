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

    })
    it('Set Default theme with Invalid API and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copyssss`,
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
    it('Copy campaign with the Invalid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken')
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
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
    it('Copy campaign with the Invalid Api and InValid method', () => {
        const accessToken = Cypress.env('accessToken')
        cy.request({
            method: 'PUT',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copsssy`,
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
    it('Copy campaign with the with title as Empty', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.title).to.eql([
                "The title field is required."
            ])
        })
    })
    it('Copy campaign with the with title as upperlimit', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean scelerisque maximus scelerisque. Aliquam venenatis pretium libero sed condimentum. Nam felis leo, commodo non porttitor et, cursus eget ligula. Curabitur aliquet dapibus turpis, in aliquet ipsum pharetra ac non.",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.title).to.eql([
                "The title may not be greater than 255 characters."
            ])
        })
    })
    it('Copy campaign with the with title as integer', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": 1,
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.title).to.eql([
                "The title must be a string."
            ])
        })
    })
    it('Copy campaign with the with Slug as Empty', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": "",
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.slug).to.eql([
                "The slug field is required."
            ])
        })
    })
    it('Copy campaign with the with slug as upperlimit', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean scelerisque maximus scelerisque. Aliquam venenatis pretium libero sed condimentum. Nam felis leo, commodo non porttitor et, cursus eget ligula. Curabitur aliquet dapibus turpis, in aliquet ipsum pharetra ac non.",
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.slug).to.eql([
                "The slug must be a lowercase.",
                "The slug may only contain letters, numbers, and dashes.",
                "The slug may not be greater than 50 characters.",
                "The slug format is invalid."
            ])
        })
    })
    it('Copy campaign with the with title as integer', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": 1,
                "slug": 1,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.slug).to.eql([
                "The slug must be a lowercase.",
                "The slug format is invalid."
            ])

        })
    })
    it('Copy campaign with the with Invalid Banner', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": "",
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36W",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.banner).to.eql([
                "The banner must end with one of the following: .jpg, png, jpeg."
            ])
        })
    })
    it('Copy campaign with the with slug as upperlimit', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssslycv2sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssslycv2sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssslycv2sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssslycv2ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.banner).to.eql([
                "The banner may not be greater than 255 characters."
            ])
        })
    })
    it('Copy campaign with the with Banner as integer', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": randomName,
                "banner": 1,
                "header": "string",
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.banner).to.eql([
                "The banner format is invalid.",
                "The banner must end with one of the following: .jpg, png, jpeg."
            ])

        })
    })
    it('Copy campaign with the with Header as integer', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": 1,
                "footer": "string",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.header).to.eql([
                "The header must be a string."
            ])

        })
    })
    it('Copy campaign with the with Header as integer', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "HEader",
                "footer": 1,
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.footer).to.eql([
                "The footer must be a string."
            ])

        })
    })
    it('Copy campaign with the with Start date with invalid date', () => {
        const accessToken = Cypress.env('accessToken')
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "HEader",
                "footer": 1,
                "start_date": "2025-4-22",
                "end_date": "2025-07-18 00:00:00"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.body.body.start_date).to.eql([
                "The start date does not match the format Y-m-d H:i:s."
            ])

        })
    })
    it('Copy campaign with the with All valid fields', () => {
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

        cy.then('Update the Defualt campaign theme and get the Layoutname.', () => {
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
        });
        const randomName = Array.from({ length: 10 }, () => Math.random().toString(12)[2]).join('');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/copy`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                "title": "Cypress Campaign Copy",
                "slug": randomName,
                "banner": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png",
                "header": "Header",
                "footer": "Footer",
                "start_date": "2025-04-22 00:00:00",
                "end_date": "2025-07-22 00:00:00",
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Site Response:', JSON.stringify(response));
            expect(response.status).to.eql(200)
            expect(response.body.body.title).to.eql('Cypress Campaign Copy')
            expect(response.body.body.banner).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png')
            expect(response.body.body.header).to.eql('Header')
            expect(response.body.body.footer).to.eql('Footer')
            expect(response.body.body.layout).to.eql(layoutName)

        })
    })
})






