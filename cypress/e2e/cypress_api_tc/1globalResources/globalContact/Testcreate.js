import { baseConfig } from "../../../../fixtures/baseConfig";describe('Add global contact', () => {
    const fs = require('fs');


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
    });

    it('Add address with value as upperlimit ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat felis eu tellus blandit dui.",
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'check for the success response.');
            expect(response.body.body).to.have.property('id');
            const contactId = response.body.body.id;
            cy.writeFile('cypress\\fixtures\\variables.json', {contactId});
            
        });
    });
});