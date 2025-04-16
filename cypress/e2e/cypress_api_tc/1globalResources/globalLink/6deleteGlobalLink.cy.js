import { baseConfig } from "../../../../fixtures/baseConfig";let linkId;
describe('Read Global List', () => {
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
                url: baseConfig.baseUrl + '/links',
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum/",
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
                expect(response.status).to.eql(200, 'Check Global link request is sucessful');
                expect(response.body.body).to.have.property('title');
                expect(response.body.body.title).to.eql('Cypress Automation Link')
                expect(response.body.body.description).to.eql(null)
                expect(response.body.body.thumbnail_url).to.eql(null)
                expect(response.body.body.status).to.eql(2)
                expect(response.body.body.open_in_external).to.eql(true)
                expect(response.body.body).to.have.property('id');
                const linkId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
          cy.log("Read The variables")
          cy.readFile('cypress/fixtures/variables.json').then((data) => {
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
    it('Delete All links with valid api and valid method.', () => { 
        const accessToken = Cypress.env('accessToken');
      
        cy.request({
          method: 'GET',
          url: baseConfig.baseUrl + '/links?page=1&title=Cypress&status=&sort_by=title&sort_order=asc&position=&is_global=&domain=www',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // Validate the response
          expect(response.status).to.eq(200);
          expect(response.body.body).to.have.property('data');
      
          const links = response.body.body.data; // Get the list of links
          const filteredLinks = links.filter(links => links.title === 'Cypress Automation Link'); // Filter contacts
      
          // Loop through the filtered contacts and delete each
          for (let i = 0; i < filteredLinks.length; i++) {
            const linkId = filteredLinks[i].id;
      
            cy.request({
              method: 'DELETE',
              url: `${baseConfig.baseUrl}/links/${linkId}`,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              failOnStatusCode: false,
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.eql(200); // Validate successful deletion
              
              cy.log(`Deleted contact with ID: ${linkId}`);
            });
          }
        });
      });   
    

});
