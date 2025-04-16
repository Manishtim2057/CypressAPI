import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Change Status of Site Document', () => {
    let documentId;
    before(()=>{

    
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
    cy.log('Create Document')
    cy.then(()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,           
             body:{
                "title": "Cypress Automation Document",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 2,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body).to.have.property('id');
         const documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = { ...data, documentId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
        });
    });

    cy.readFile('cypress/fixtures/variables.json').then((data) => {
        documentId = data.documentId;
    });
});

    it('change the status of Site Document with invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contact/1/statuss',
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

    it('change the status of Site Document with Invalid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + 'site/358/documentsss',
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

    it('change the status of Site Document with valid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}` ,
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
    });

    it('Change the status of Site Document with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/status` ,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Document');

        });
    });



    it('Change Status of Site Document with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/status` ,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Document');

        });
    });
})
