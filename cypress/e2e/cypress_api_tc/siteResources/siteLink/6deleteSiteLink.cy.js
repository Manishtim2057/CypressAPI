import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Read Global List', () => {
let linkId;
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


    it('Delete Global Link with Invalid api and valid method', () =>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url : baseConfig.baseUrl + '/links/8',
           headers:{
            Authorization: `Bearer ${accessToken}`,

           },
           failOnStatusCode: false,
        }).then((response)=>{
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
    
        });
    });

    
    it('Delete Global Link with valid api and Invalid method', () =>{
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url : baseConfig.baseUrl + '/links/8',
           headers:{
            Authorization: `Bearer ${accessToken}`,

           },
           failOnStatusCode: false,
        }).then((response)=> {
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
        expect(response.body.status).to.have.property('message');
        expect(response.body.status.message).to.be.eql('Invalid method call.');
        });
    });

        
    it('Delete Global Link with Invalid api and Invalid method', () =>{
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url : baseConfig.baseUrl + '/linkss/8',
           headers:{
            Authorization: `Bearer ${accessToken}`,

           },
           failOnStatusCode: false,
        }).then((response)=> {
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
    
        });
    });
        
    it('Delete Global Link with valid api and valid method', () =>{
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links/${linkId}`,
           headers:{
            Authorization: `Bearer ${accessToken}`,

           },
           failOnStatusCode: false,
        }).then((response)=> {
            expect(response.status).to.eql(200, 'Check for Not found error');    
        });
    });
});
