import { baseConfig } from "../../../../fixtures/baseConfig";describe('Config images Detailed view', () => {
let config_images;

    before(() => {
        cy.request({
            method: 'POST',
            url: 'https://lyb-v2-laravel.test/api/auth/authenticate',
            body: {
                "username": "superuser@learnyourbenefits.com",
                "password": "lyb@20!9"
            }
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.log('Fetching the Configed Contact list with access token.');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                const config_images = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, config_images };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            config_images = data.config_images
        });
    });

    it('Config image Details with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-configsss'+ config_images,
            body: {
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/images/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "image_id": 5
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    });


    it('Config image Details with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-configsss'+ config_images,
            body: {
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/images/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "image_id": 5
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    });


    it('Config image Details with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/'+ config_images,
            body: {
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/images/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "image_id": 5
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');


        });
    });

    

    it('Config image Details with valid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/sites/'+ baseConfig.siteId + '/image-config/' + config_images,
            body: {
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/images/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "image_id": 5
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');

        });
    });
});