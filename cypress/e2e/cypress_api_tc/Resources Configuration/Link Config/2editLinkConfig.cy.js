import { baseConfig } from "../../../../fixtures/baseConfig";describe('Edit Config links', () => {
    let config_links;
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
        cy.log('Fetching the Configed Contact list with access token.');
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                const config_links = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, config_links };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            config_links = data.config_links
        });
    });

    it('Edit Config link with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-configsss/asdasdasdasda',
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
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


    it('Edit Config link with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-configss/' + config_links,
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null
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


    it('Edit Config link with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null
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

    it('Edit Configured link with Title as null',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
            body:{
                "title": null,
                "description": "This is an Configured link description.",
                "thumbnail_url": null
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

    it('Edit Configured link with Title as upperlimit+1.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
            body: {
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                    "description": "This is an Configured link description.",
                    "thumbnail_url": null,
                    "auto_generate_thumbnail": true

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
    

    it('Edit Configured link with as thumbnailUrl as invalid.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "auto_generate_thumbnail": true,
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
    
    it('Edit Configured link with as thumbnailUrl as null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "auto_generate_thumbnail": true

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
    
    it('Edit Configured link auto Generate thumbnail as False',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
           body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "auto_generate_thumbnail": false
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
    it('Edit Configured link with as description as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
           body:{
                "title": "Configured link",
                "description": null,
                "thumbnail_url": null,
                "auto_generate_thumbnail": true
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
    
    it('Edit Configured link with all field as Valid',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
           body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.jpg",
                "auto_generate_thumbnail": true
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
            expect(response.body.body.title).to.eql('Configured link');
            expect(response.body.body.description).to.eql('This is an Configured link description.');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.jpg')
        });
    })
    
    
    it('Edit Configured link with all field as Valid',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/' + config_links,
            body:{
                "title": "Configured link",
                "description": "This is an Configured link description.",
                "thumbnail_url": null,
                "auto_generate_thumbnail": true
            }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success Status');
            expect(response.body.body.title).to.eql('Configured link');
            expect(response.body.body.description).to.eql('This is an Configured link description.');
            expect(response.body.body.thumbnail_url).to.eql(null)
        });
    })
    
    
    
});