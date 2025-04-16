import { baseConfig } from "../../../../fixtures/baseConfig";let documentId
describe('Delete Global Document', () => {
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
        cy.log("Create Global Document")
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/documents',
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pptxDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.jpgImage,
                    "order": 8,
                    "status": 1,
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

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            documentId = data.documentId
        });
    });

    it('Delete Global Document with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/documentss/2',
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
    it('Delete Global Document with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/documents/2',
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
    it('Delete Global Document with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/documentss/8',
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
    it('Delete Global Document with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/documents/' + documentId,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

        });
    });
    it('Delete All Documents with valid api and valid method.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/documents?page=1&title=Cypress&status=&sort_by=title&sort_order=asc&position=&is_global=&domain=www',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            // Validate the response
            expect(response.status).to.eq(200);
            expect(response.body.body).to.have.property('data');

            const documents = response.body.body.data; // Get the list of documents
            const filtereddocuments = documents.filter(document => document.title === 'Cypress Automation'); // Filter documents

            // Loop through the filtered documents and delete each
            for (let i = 0; i < filtereddocuments.length; i++) {
                const documentId = filtereddocuments[i].id;

                cy.request({
                    method: 'DELETE',
                    url: `${baseConfig.baseUrl}/documents/${documentId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    failOnStatusCode: false,
                }).then((deleteResponse) => {
                    expect(deleteResponse.status).to.eql(200); // Validate successful deletion

                    cy.log(`Deleted contact with ID: ${documentId}`);
                });
            }
        });
    });
})
