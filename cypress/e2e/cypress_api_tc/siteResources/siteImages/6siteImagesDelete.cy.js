import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Delete Global Images', () => {
    let imageId;
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
     cy.log('Add the Site Documentss')
          cy.then(() => {
              const accessToken = Cypress.env('accessToken');
              cy.request({
                  method: 'POST',
                  url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images`,
                  body: {
                      "title": "Cypress Automation Images",
                      "url": baseConfig.pngImage,
                      "description": "This is an Description for images.",
                      "status": 1,
                      "icon": "far fa-file-images"
                  },
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                  },
                  failOnStatusCode: false,
              }).then((response) => {
                  cy.log('Login Response:', JSON.stringify(response));
                  expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
                  expect(response.body.body).to.have.property('id');
                  const imageId = response.body.body.id;
                  cy.readFile('cypress/fixtures/variables.json').then((data) => {
                      const updatedData = { ...data, imageId };
                      cy.writeFile('cypress/fixtures/variables.json', updatedData);
                  });
              });
       });
       cy.log('Read the variables')
       cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
          imageId = data.imageId
  
          });
      });

    it('Delete Global Images with Invalid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + 'sitess/358/images/34',
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


    it('Delete Global Images with valid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/images/34',
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
    it('Delete Global Images with Invalid api and InValid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: baseConfig.baseUrl + 'sites/358/imagess/34',
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

    it('Delete Global Images with Valid api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
           
        });
    });
})