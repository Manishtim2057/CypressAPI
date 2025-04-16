import { baseConfig } from "../../../../fixtures/baseConfig";
let imageId;
describe('Edit Site Image',()=>{

    before(() => {
        cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body:{
            "username": "superuser@learnyourbenefits.com",
            "password": "lyb@20!9"
        },
        failOnStatusCode: false,
        }).then((response)=>{
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

    it('Edit images with Invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/imagess',
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
    
    it('Edit images with Invalid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/imagess/sdfsdf',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
    
        });
    });
    
    it('Edit images with valid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
             url: baseConfig.baseUrl + '/sites/358/images/'+ baseConfig.siteImagesId,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');
    
        });
    });
    
    it('Edit images with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation Edited",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.be.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation Edited');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for images.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');


        });
    });

    it('Edit images title as Upperlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for images.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });


    it('Edit images title as lowerlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "O",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('O');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for images.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
    

    it('Edit images title as Upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
             url: baseConfig.baseUrl + '/sites/358/images/'+ baseConfig.siteImagesId,
            body:{
                 "title": "Lorem ipsssum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Images');
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.');
           
        });
    });
    it('Edit images title as empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
             url: baseConfig.baseUrl + '/sites/358/images/'+ baseConfig.siteImagesId,
            body:{
                 "title": "",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Images');
            expect(response.body.body.title[0]).to.eql('The title field is required.');
        });
    });
    
    it('Edit images title as String.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation Edited",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation Edited');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for images.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
    
    it('Edit images title as Integer.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
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
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for images.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
    
    
    it('Edit images Description as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": baseConfig.pngImage,
                 "description": null,
                 "status": 1,
                 "icon": "far fa-file-images"   
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
    
    
    
    it('Edit images image type as JPG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": baseConfig.jpgImage,
                 "description": null,
                 "status": 1,
                 "icon": "far fa-file-images"   
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.jpg');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
       
    
    it('Edit images image type as PNG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": baseConfig.pngImage,
                 "description": null,
                 "status": 1,
                 "icon": "far fa-file-images"   
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
       
    
    it('Edit images image type as JPEG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": baseConfig.jpegImage,
                 "description": null,
                 "status": 1,
                 "icon": "far fa-file-images"   
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.jpeg');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
       
    
    it('Edit images image type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": baseConfig.gifImage,
                 "description": null,
                 "status": 1,
                 "icon": "far fa-file-images"   
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.gif');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
       
    
    it('Edit images image type as Invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.",
                 "description": null,
                 "status": 1,
                 "icon": "far fa-file-images"   
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Images');
            expect(response.body.body.url[0]).to.eql('The url must end with one of the following: .png, .jpg, .jpeg, .gif, .svg.')
        
        });
    });  
    it('Edit images image type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
              url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${imageId}`,
            body:{
                 "title": "Cypress Automation",
                 "url": baseConfig.gifImage,
                 "description": null,
                 "status": 2,
                 "icon": "far fa-file-images"   
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.gif');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-images');
        });
    });
    
    it('Add with Superuser permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.superadminPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        it('Add Images  with valid with Superadmin Permission.', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/images',
                body: {
                    "title": "Cypress Automation",
                    "url": baseConfig.gifImage,
                    "description": null,
                    "status": 2,
                    "icon": "far fa-file-images"   
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');
                expect(response.body.body.title).to.eql('Cypress Automation');
                expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.gif');
                expect(response.body.body.description).to.eql(null);
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.icon).to.eql('far fa-file-images');
            });
        });

    });
    it('Add with MasterAdmin permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.masterPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        it('Add Images with valid with Superadmin Permission.', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/images',
                body: {
                    "title": "Cypress Automation",
                    "url": baseConfig.gifImage,
                    "description": null,
                    "status": 2,
                    "icon": "far fa-file-images"   
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');
                expect(response.body.body.title).to.eql('Cypress Automation');
                expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.gif');
                expect(response.body.body.description).to.eql(null);
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.icon).to.eql('far fa-file-images');
            });
        });
    });

    it('Add with Site Read permission', () => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.siteReadPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token);
        });
        it('Add Images type as Valid with Site Read Permission.', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/links',
                body: {
                    "title": "Cypress Automation",
                    "url": baseConfig.gifImage,
                    "description": null,
                    "status": 2,
                    "icon": "far fa-file-images"   
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status for Insufficient permission.');
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");

            });
        });
    });

});





