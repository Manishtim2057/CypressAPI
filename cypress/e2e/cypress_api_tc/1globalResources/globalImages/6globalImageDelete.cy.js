import { baseConfig } from "../../../../fixtures/baseConfig";let imageId;
describe('Delete Global Images', () => {
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
                url: baseConfig.baseUrl + '/images',
                body: {
                    "title": "Cypress Automation",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
                    "status": 2,
                    "icon": "far fa-file-images"
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');
                expect(response.body.body.title).to.eql('Cypress Automation');
                expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
                expect(response.body.body.description).to.eql('This is an Description for images.');
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.icon).to.eql('far fa-file-images');
                expect(response.body.body).to.have.property('id');
                const imageId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, imageId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });

        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            imageId = data.imageId
        });

    });


    it('Delete Global Images with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/imagess/2',
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    })


    it('Delete Global Images with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/images/2',
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');
        });
    });
    it('Delete Global Images with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/imagess/8',
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('Delete Global Images with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/images/' + imageId,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

        });
    });

    it('Delete All Images with valid api and valid method.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/images?page=1&title=Cypress&status=&sort_by=title&sort_order=asc&position=&is_global=&domain=www',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            // Validate the response
            expect(response.status).to.eq(200);
            expect(response.body.body).to.have.property('data');

            const images = response.body.body.data; // Get the list of images
            const filteredImages = images.filter(image => image.title === 'Cypress Automation'); // Filter images

            // Loop through the filtered images and delete each
            for (let i = 0; i < filteredImages.length; i++) {
                const imageId = filteredImages[i].id;

                cy.request({
                    method: 'DELETE',
                    url: `${baseConfig.baseUrl}/images/${imageId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    failOnStatusCode: false,
                }).then((deleteResponse) => {
                    expect(deleteResponse.status).to.eql(200); // Validate successful deletion

                    cy.log(`Deleted image with ID: ${imageId}`);
                });
            }
        });
    });
}); 