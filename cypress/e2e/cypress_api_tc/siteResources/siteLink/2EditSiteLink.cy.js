import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Edit Global Link', () => {
    let linkId;

    before(() => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: {
                username: "superuser@learnyourbenefits.com",
                password: "lyb@20!9"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token);
        });
        cy.log('Add the Site Link')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links`,
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
                expect(response.body.body).to.have.property('id');
                const linkId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
     });
     cy.log('Read the variables')
     cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
        linkId = data.linkId

        });
    });

    it('Edit Site link with invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/linkss/asdasdsadas',
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    })


    it('Edit Site link with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        });
    })


    it('Edit Site link with invalid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/linkss/28',
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    })

    it('Edit Site Link with Title as Upperlimit + 1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.')
        });
    });


    it('Edit Site Link with Title as Empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title[0]).to.eql('The title field is required.')
        });
    });

    it('Edit Site Link with Title as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": null,
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title[0]).to.eql('The title field is required.')
        });
    });

    it('Edit Site Link with url as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": null,
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.url[0]).to.eql('The url field is required.')
        });
    });


    it('Edit Site Link with url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "lipsum/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.url[0]).to.eql('The url format is invalid.')
        });
    });

    it('Edit Site Link with Thumbnail url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb",
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.thumbnail_url[0]).to.eql('The thumbnail url must end with one of the following: .jpg, .png, .jpeg.')
        });
    });

    it('Edit Site Link with Thumbnail url as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/.com",
                "thumbnail_url": null,
                "status": 2,
                "open_in_external": true,
                "auto_generate_thumbnail": false

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title).to.eql('Cypress Automation Link')
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.open_in_external).to.eql(true)

        });
    });


    it('Edit Site Link with API as Invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/links/asdasdas',
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/.com",
                "thumbnail_url": null,
                "status": 2,
                "open_in_external": true,
                "auto_generate_thumbnail": false

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check Not Found Error');
        });
    });
    it('Edit Site Link with status as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/",
                "thumbnail_url": "",
                "open_in_external": true,
                "status": 5

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.status[0]).to.eql('The selected status is invalid.')
        });
    });


    it('Edit Site Link with open in external as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/.com",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 33,
                "open_in_external": 333

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.open_in_external[0]).to.eql('The open in external field must be true or false.')
        });
    });


    it('Edit Site Link with All valid Fields', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true,
                "auto_generate_thumbnail": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title).to.eql('Cypress Automation Link')
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.open_in_external).to.eql(true)


        });
    });



    it('Edit with Superuser permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.superadminPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });

        it('Edit Documents with valid with Superadmin Permission.', () => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum.com/",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
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
                expect(response.body.body).to.have.property('title');
                expect(response.body.body.title).to.eql('Cypress Automation Link');
                expect(response.body.body.description).to.eql(null);
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.open_in_external).to.eql(true);


            });
        });
    });
    it('Edit with MasterAdmin permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.superadminPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        it('Edit Documents with valid with Masteradmin Permission.', () => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum.com/",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
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
                expect(response.body.body).to.have.property('title');
                expect(response.body.body.title).to.eql('Cypress Automation Link');
                expect(response.body.body.description).to.eql(null);
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.open_in_external).to.eql(true);


            });
        });
    });

    it('Edit with Site Read permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.siteReadPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token);
        });
        it('Edit Documents type as Valid with Site Read Permission.', () => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId} `,
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum.com/",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                    "status": 2,
                    "open_in_external": true

                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status for Insufficient permission.');
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");

            });
        });
    });

});

