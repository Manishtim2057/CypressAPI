import { baseConfig } from "../../../../fixtures/baseConfig";   
describe('Delete Global Contact', () => {
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
    });
    it('Delete Global Contact with Valid api and Valid method', () => {
        cy.readFile('cypress\\fixtures\\variables.json').then((data) =>{
            const contactId = data.contactId
        const accessToken = Cypress.env('accessToken'); 
            cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/contacts/' + contactId,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
           
        });
        
    });
});
});