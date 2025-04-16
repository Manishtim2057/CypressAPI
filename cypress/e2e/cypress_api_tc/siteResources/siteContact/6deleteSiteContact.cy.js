import { baseConfig } from "../../../../fixtures/baseConfig";let siteContactId;
describe('Delete Site Contact', () => {
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
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contacts',
                body: {

                    "title": "Cypress Automation",
                    "description": "It is a description.",
                    "value": "manis@gmail.com",
                    "type": 1,
                    "status": 2,
                    "thumbnail_url": null
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.body.body.title).to.eql('Cypress Automation');
                expect(response.body.body.description).to.eql('It is a description.');
                expect(response.body.body.value).to.eql('manis@gmail.com');
                expect(response.body.body.type).to.eql(1);
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.thumbnail_url).to.eql(null);


                const siteContactId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteContactId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });


        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            siteContactId = data.siteContactId
        });
    });

    it('Delete Site Contact with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/contactss/2',
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


    it('Delete Site Contact with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts/46',
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
    it('Delete Site Contact with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/sites/358/contssacts/46',
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

    it('Delete Site Contact with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contacts/' + siteContactId,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');

        });
    });

    it('Delete All Site Contacts with valid api and valid method.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contacts?page=1&title=Cypress&status=&sort_by=title&sort_order=asc&position=&is_global=&domain=www',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            // Validate the response
            expect(response.status).to.eq(200);
            expect(response.body.body).to.have.property('data');

            const siteContactId = response.body.body.data; // Get the list of contacts
            const filteredContacts = siteContactId.filter(contact => siteContactId.title === 'Cypress Automation'); // Filter contacts

            // Loop through the filtered contacts and delete each
            for (let i = 0; i < filteredContacts.length; i++) {
                const siteContactId = filteredContacts[i].id;

                cy.request({
                    method: 'DELETE',
                    url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contacts' + siteContactId,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    failOnStatusCode: false,
                }).then((deleteResponse) => {
                    expect(deleteResponse.status).to.eql(200); // Validate successful deletion

                    cy.log(`Deleted contact with ID: ${siteContactId}`);
                });
            }
        });
    });
});