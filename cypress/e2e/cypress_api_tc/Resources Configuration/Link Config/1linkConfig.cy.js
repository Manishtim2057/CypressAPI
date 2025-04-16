import { baseConfig } from "../../../../fixtures/baseConfig";describe('Config links', () => {
    let linkForConfig;
    before(() => {
        cy.log('Fetching the Token')
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
        cy.log('Create the Global Contact.')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/links',
                body: {
                 
                "title": "Cypress Automation Link",
                "description": null,
                "url": "https://www.lipsum.com/",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                "status": 2,
                "open_in_external": true
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Add Contact Response:', JSON.stringify(response));
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'check for the success response.');
                expect(response.body.body).to.have.property('id');
                const linkForConfig = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkForConfig };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        }); 
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            linkForConfig = data.linkForConfig
        });
    });



    it('Config link with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-configsss',
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "link_id": linkForConfig
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    });


    it('Config link with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-configsss',
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "link_id": linkForConfig
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');


        });
    });


    it('Config link with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "link_id": linkForConfig
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');


        });
    });

    it('Configured link with Title as null',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
            body:{
                "title": null,
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "link_id": linkForConfig
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.title[0]).to.eql('The title field is required.');
        });
    })

    it('Configured link with Title as upperlimit+1.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
            body: {
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                    "description": "This is an Configured link description.",
                    "thumbnail_url": null,
                    "link_id": linkForConfig

                  },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.');
        });
    })
    

    it('Configured link with as thumbnailUrl as invalid.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "link_id": linkForConfig,
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.thumbnail_url[0]).to.eql('The thumbnail url must end with one of the following: .jpg, .png, .jpeg, .svg.');
        });
    });
    
    it('Configured link with as link id as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
           body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "link_id": null

              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.link_id[0]).to.eql('The link id field is required.');
        });
    });

    
    it('Configured link with as description and Thumbnail as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/',
           body:{
                "title": "Configured link",
                "description": null,
                "thumbnail_url": null,
                "link_id":linkForConfig
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for validation error');
        });
    });
    
    it('Configured link with all field as Valid',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
           body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.jpg",
                "link_id": linkForConfig
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
            expect(response.body.status.message).to.be.eql('Okay')

        });
    })
  
    
    
    
});