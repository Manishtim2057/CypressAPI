import { baseConfig } from "../../../../fixtures/baseConfig";describe('Edit Config images', () => {
    let config_images;
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
        cy.log('Fetching the Configed Images list with access token.');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                const config_images = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, config_images };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });

        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            config_images = data.config_images
        });
    });

    it('Edit Config image with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-configsssasdasds/asdasdasd',
            body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": "far fa-file-powerpoint"
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


    it('Edit Config image with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-configss/' + config_images ,
            body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": "far fa-file-powerpoint"
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


    it('Edit Config image with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
            body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": "far fa-file-powerpoint"
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

    it('Edit Configured image with Title as null',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
            body:{
                "title": null,
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": "far fa-file-powerpoint"
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

    it('Edit Configured image with Title as upperlimit+1.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
            body: {
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                    "description": "This is an Configured image description.",
                    "image_id": baseConfig.imagesId,
                    "icon": "far fa-file-powerpoint"
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
    
    it('Edit Configured image with as image id as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
           body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "icon": "far fa-file-powerpoint"
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

     
    it('Configured document with as description as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/'+ config_images,
           body:{
                "title": "Configured image",
                "description": null,
                "icon": "ImagesIcon"
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
        });
    });
    
    it('Edit Configured image with as icon as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
           body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": null
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.icon[0]).to.eql('The icon field is required.');
        });
    })
    
    
    it('Edit Configured image with all field as Valid',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
           body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": "far fa-file-powerpoint"
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
            expect(response.body.body.title).to.eql('Configured image');
            expect(response.body.body.description).to.eql('This is an Configured image description.')
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint')
        });
    })
    
    
    it('Edit Configured image with all field as Valid',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config/' + config_images ,
            body:{
                "title": "Configured image",
                "description": "This is an Configured image description.",
                "image_id": baseConfig.imagesId,
                "icon": "far fa-file-powerpoint"
              }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
            expect(response.body.body.title).to.eql('Configured image');
            expect(response.body.body.description).to.eql('This is an Configured image description.')
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint')
        });
    })
    
    
    
});