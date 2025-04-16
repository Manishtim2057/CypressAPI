import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Create Global Link', () => {

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
    });

    it('Create Global link with invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/linkss',
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
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    })


    it('Create Global link with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/links',
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
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        });
    })


    it('Create Global link with invalid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/linkss',
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
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    })

    it('Create Global Link with Title as Upperlimit + 1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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
            expect(response.status).to.be.eql(417, 'Check for validation error');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.')
        });
    });

    
    it('Create Global Link with Title as Empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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

    it('Create Global Link with Title as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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

    it('Create Global Link with url as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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

    
    it('Create Global Link with url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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

    it('Create Global Link with Thumbnail url as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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

    it('Create Global Link with Thumbnail url as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/",
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
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title).to.eql('Cypress Automation Link')
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.open_in_external).to.eql(true)
        });
    });


    it('Create Global Link with status as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/",
                "thumbnail_url": "",
                "open_in_external": true,
                "status":5

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


    it('Create Global Link with open in external as invalid', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
            body: {

                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum/",
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


    it('Create Global Link with All valid Fields', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/links',
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
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title).to.eql('Cypress Automation Link')
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.open_in_external).to.eql(true)


        });
    });

});