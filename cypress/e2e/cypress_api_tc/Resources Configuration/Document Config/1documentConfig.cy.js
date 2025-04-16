import { baseConfig } from "../../../../fixtures/baseConfig";describe('Config documents', () => {
    
    let documentForConfig;
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
        cy.log('Create the Global Documents.')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/documents',
                body: {
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
                expect(response.body.body.title).to.eql('Cypress Automation Document');
                expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
                expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
                expect(response.body.body.description).to.eql('This is an Description for Documents.');
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
                const documentForConfig = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentForConfig };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            documentForConfig = data.documentForConfig
        });
    });
   
    
    it('Config document with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-configsss',
            body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": documentForConfig,
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


    it('Config document with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-configsss',
            body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": documentForConfig,
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


    it('Config document with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
            body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": documentForConfig,
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

    it('Configured document with Title as null',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
            body:{
                "title": null,
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": documentForConfig,
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

    it('Configured document with Title as upperlimit+1.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
            body: {
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                    "description": "This is an Configured document description.",
                    "thumbnail_url": null,
                    "document_id": documentForConfig,
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
    

    it('Configured document with as thumbnailUrl as invalid.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
            body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "document_id": documentForConfig,
                "icon": "far fa-file-powerpoint",
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
    it('Configured document with as thumbnailUrl and Description as null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
            body:{
                "title": "Configured Document",
                "description": null,
                "thumbnail_url": null,
                "document_id": documentForConfig,
                "icon": "far fa-file-powerpoint"
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body.title).to.eql('Configured Document')
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.thumbnail_url).to.eql(null);
         });
    });
    
    it('Configured document with as document id as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
           body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": null,
                "icon": "far fa-file-powerpoint"
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.document_id[0]).to.eql('The document id field is required.');
        });
    })

    
    it('Configured document with as icon as Null.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
           body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": documentForConfig,
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
    
    
    it('Configured document with all field as Valid',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
           body:{
                "title": "Configured Document",
                "description": "This is an Configured document description.",
                "thumbnail_url": null,
                "document_id": documentForConfig,
                "icon": "far fa-file-powerpoint"
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(409, 'Check for success Status');
            expect(response.body.status.message).to.be.eql('Document already configured.')

        });
    })   
});