import { baseConfig } from "../../../../../fixtures/baseConfig";
let linkId1;
let linkId2;
describe('Change Status of Document', () => {

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
                url: baseConfig.baseUrl + '/links',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const linkId1 = response.body.body.data[0].id;
                const linkId2 = response.body.body.data[1].id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId1, linkId2 };
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
    it('Change the status of Contact with valid api and Invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/links/multiple/status',
            body: {
                "ids": [
                    linkId1, linkId2
                ],
                "status": 1
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
            url: baseConfig.baseUrl + '/links/multiple/statussss',
            body: {
                "ids": [
                    linkId1, linkId2
                ],
                "status": 1
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
            url: baseConfig.baseUrl + '/links/multiple/statusss',
            body: {
                "ids": [
                    linkId1, linkId2
                ],
                "status": 1
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
            method: 'PUT',
            url: baseConfig.baseUrl + '/links/multiple/status',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "ids": [
                    linkId1, linkId2
                ],
                "status": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
        });
    });
});