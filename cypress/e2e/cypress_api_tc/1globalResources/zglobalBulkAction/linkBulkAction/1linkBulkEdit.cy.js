import { baseConfig } from "../../../../../fixtures/baseConfig";
let linkId2;
let linkId1;

describe('Edit Global Bulk Link', () => {
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
        cy.log("Create Global Contact")
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/links',
                body: {
                    "title": "Cypress Automation Link",
                    "description": "Empty",
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
                cy.log('Add Contact Response:', JSON.stringify(response));

                // Verify response status
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'check for the success response.');
                expect(response.body.body).to.have.property('id');
                const linkId2 = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        console.log('Create the Another Contact as well.')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/links',
                body: {
                    "title": "Cypress Automation Link",
                    "description": "Empty",
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
                cy.log('Add Contact Response:', JSON.stringify(response));

                // Verify response status
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'check for the success response.');
                expect(response.body.body).to.have.property('id');
                const linkId1 = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId1 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            linkId1 = data.linkId1
            linkId2 = data.linkId2
        });
    });

    it('Edit Bulk link with invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/linkss',
            body: {
                "data": [
                    {

                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    })


    it('Edit Bulk link with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {
                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true
                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        });
    })


    it('Edit Bulk link with invalid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/linkss',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    })

    it('Edit Bulk Link with Title as Upperlimit + 1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.be.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.title']).to.eql(['The data.0.title may not be greater than 255 characters.']);
        });
    });


    it('Edit Bulk Link with Title as Empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);

        });
    });

    it('Edit Bulk Link with Title as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": null,
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);

        });
    });

    it('Edit Bulk Link with url as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": null,
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.url']).to.eql(['The data.0.url field is required.']);
        });
    });


    it('Edit Bulk Link with url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.url"]).to.eql(['The data.0.url format is invalid.'])
        });
    });

    it('Edit Bulk Link with Thumbnail url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.thumbnail_url"]).to.eql([
                "The data.0.thumbnail_url must end with one of the following: .jpg, .png, .jpeg."
            ]);
        });
    });

    it('Edit Bulk Link with Thumbnail url as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "asd",
                        "url": "https://www.lipsum/.com",
                        "thumbnail_url": null,
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
        });
    });


    it('Edit Bulk Link with status as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "",
                        "open_in_external": true,
                        "status": 5


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.status"]).to.eql(['The selected data.0.status is invalid.'])
        });
    });


    it('Edit Bulk Link with open in external as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 33,
                        "open_in_external": 333


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.open_in_external"]).to.eql(['The data.0.open_in_external field must be true or false.'])
        });
    });
    it('Edit Bulk Link with description as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": null,
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 33,
                        "open_in_external": 333


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.description"]).to.eql([
                "The data.0.description field is required."
            ]
            )
        });
    });


    it('Edit Bulk Link with All valid Fields', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        });
    });

    ////////////////////////////////


    it('Edit Bulk Link with Title as Upperlimit + 1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.be.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.title']).to.eql(['The data.0.title may not be greater than 255 characters.']);
            expect(response.body.body['data.1.title']).to.eql(['The data.1.title may not be greater than 255 characters.']);
        });
    });


    it('Edit Bulk Link with Title as Empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
            expect(response.body.body["data.1.title"]).to.eql(['The data.1.title field is required.']);

        });
    });

    it('Edit Bulk Link with Title as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": null,
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": null,
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
            expect(response.body.body["data.1.title"]).to.eql(['The data.1.title field is required.']);

        });
    });

    it('Edit Bulk Link with url as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": null,
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": null,
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.url']).to.eql(['The data.0.url field is required.']);
            expect(response.body.body['data.1.url']).to.eql(['The data.1.url field is required.']);
        });
    });


    it('Edit Bulk Link with url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.url"]).to.eql(['The data.0.url format is invalid.'])
            expect(response.body.body["data.1.url"]).to.eql(['The data.1.url format is invalid.'])
        });
    });

    it('Edit Bulk Link with Thumbnail url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.thumbnail_url"]).to.eql([
                "The data.0.thumbnail_url must end with one of the following: .jpg, .png, .jpeg."
            ]);
            expect(response.body.body["data.1.thumbnail_url"]).to.eql([
                "The data.1.thumbnail_url must end with one of the following: .jpg, .png, .jpeg."
            ]);
        });
    });

    it('Edit Bulk Link with Thumbnail url as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "asd",
                        "url": "https://www.lipsum/.com",
                        "thumbnail_url": null,
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "asd",
                        "url": "https://www.lipsum/.com",
                        "thumbnail_url": null,
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
        });
    });


    it('Edit Bulk Link with status as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "",
                        "open_in_external": true,
                        "status": 5


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "",
                        "open_in_external": true,
                        "status": 5


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.status"]).to.eql(['The selected data.0.status is invalid.'])
            expect(response.body.body["data.1.status"]).to.eql(['The selected data.1.status is invalid.'])
        });
    });


    it('Edit Bulk Link with open in external as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 33,
                        "open_in_external": 333


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 33,
                        "open_in_external": 333


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.open_in_external"]).to.eql(['The data.0.open_in_external field must be true or false.'])
            expect(response.body.body["data.1.open_in_external"]).to.eql(['The data.1.open_in_external field must be true or false.'])
        });
    });
    it('Edit Bulk Link with description as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": null,
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 33,
                        "open_in_external": 333


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": null,
                        "url": "https://www.lipsum/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 33,
                        "open_in_external": 333


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.description"]).to.eql([
                "The data.0.description field is required."
            ])
            expect(response.body.body["data.1.description"]).to.eql([
                "The data.1.description field is required."
            ])
            
        });
    });


    it('Edit Bulk Link with All valid Fields', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple',
            body: {
                "data": [
                    {

                        "id": linkId1,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    },
                    {

                        "id": linkId2,
                        "title": "Cypress Automation Link",
                        "description": "Empty",
                        "url": "https://www.lipsum.com/",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                        "status": 2,
                        "open_in_external": true


                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        });
    });


});