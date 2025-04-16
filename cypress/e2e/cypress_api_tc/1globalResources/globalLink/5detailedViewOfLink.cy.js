import { baseConfig } from "../../../../fixtures/baseConfig";let linkId
describe('Detailed View Of Global Document', () => {
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
                expect(response.body.body).to.have.property('id');
                const linkId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            linkId = data.linkId
        });
    });
    it('Get the detailed view of Global Images along with used site field with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/links/' + linkId,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check Global link request is sucessful');
            expect(response.body.body).to.have.property('title');
            expect(response.body.body.title).to.eql('Cypress Automation Link')
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.open_in_external).to.eql(1)
            expect(response.body.body).to.have.property('id');
            expect(response.body.body).to.have.property('origin');
        });
    });



    it('Get the detailed view of Global Images along with used site field with valid api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts',
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
    });

    it('Get the detailed view of Global Images along with used site field with Invalid  api and invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contactss',
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
    });

    it('Get the detailed view of Global Images along with used site field with Invalid  api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/contactss',
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
    });

});
