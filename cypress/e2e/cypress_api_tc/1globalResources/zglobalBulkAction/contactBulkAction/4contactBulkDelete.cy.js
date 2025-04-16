import { baseConfig } from "../../../../../fixtures/baseConfig";
let contactId2;
let contactId1;
describe('Bulk Delete Document', () => {

    before(() => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: {
                "username": "superuser@learnyourbenefits.com",
                "password": "lyb@20!9"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.log('Get ids of Document');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/contacts',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const contactId2 = response.body.body.data[0].id;
                const contactId1 = response.body.body.data[1].id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, contactId1, contactId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            contactId1 = data.contactId1
            contactId2 = data.contactId2
        });
    });
    it('Change the status of Contact with valid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "ids": [
                    contactId2, contactId1
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for invalid method Error');
            
        });
    });


    it('Change the status of Contact with Invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multipleeee',
            body: {
                "ids": [
                    contactId2, contactId1
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
    });


    it('Change the status of Contact with Invalid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/documents/multiplewee',
            body: {
                "ids": [
                    contactId2, contactId1
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
    });

    it('change the status of Contact with valid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/contacts/multiple',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "ids": [
                    contactId2, contactId1
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
        });
    });
});