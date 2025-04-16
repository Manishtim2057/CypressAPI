import { baseConfig } from "../../../../fixtures/baseConfig";describe('Delete Global Contact', () => {
    let contactId;

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
                url: baseConfig.baseUrl + '/contacts',
                body: {
                    title: "Cypress Automation",
                    description: "It is a description.",
                    value: "manis@gmail.com",
                    type: 1,
                    status: 2,
                    thumbnail_url: null,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Add Contact Response:', JSON.stringify(response));

                // Verify response status
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'check for the success response.');
                expect(response.body.body).to.have.property('id');
                const contactId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, contactId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            contactId = data.contactId
        });
    });

    it('Delete Global Contact with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url : baseConfig.baseUrl + '/contactsss/1',               
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


    it('Delete Global Contact with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url : baseConfig.baseUrl + '/contacts/1',   
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
    it('Delete Global Contact with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/contactss/8',
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
    
    it('Delete Global Contact with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactId = data.contactId
        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + '/contacts/'+ contactId,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Not found error');
            });
        });
    });
       it('Delete All Contacts with valid api and valid method.', () => { 
        const accessToken = Cypress.env('accessToken');
      
        cy.request({
          method: 'GET',
          url: baseConfig.baseUrl + '/contacts?page=1&title=Cypress&status=&sort_by=title&sort_order=asc&position=&is_global=&domain=www',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // Validate the response
          expect(response.status).to.eq(200);
          expect(response.body.body).to.have.property('data');
      
          const contacts = response.body.body.data; // Get the list of contacts
          const filteredContacts = contacts.filter(contact => contact.title === 'Cypress Automation'); // Filter contacts
      
          // Loop through the filtered contacts and delete each
          for (let i = 0; i < filteredContacts.length; i++) {
            const contactId = filteredContacts[i].id;
      
            cy.request({
              method: 'DELETE',
              url: `${baseConfig.baseUrl}/contacts/${contactId}`,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              failOnStatusCode: false,
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.eql(200); // Validate successful deletion
              
              cy.log(`Deleted contact with ID: ${contactId}`);
            });
          }
        });
      });   
});