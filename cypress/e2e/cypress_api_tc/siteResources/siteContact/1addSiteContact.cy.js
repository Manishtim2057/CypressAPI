import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Add Site contact', () => {

    before(() => {
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
    });


    it('Add Site Contact with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contactss',
            body: {

                "title": "Lorem ipsum dolor",
                "description": "It is a description.",
                "value": "It is a long established fact that a reader will be distrac",
                "type": 1,
                "status": 1,
                "thumbnail_url": ""
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


    it('Add Site Contact with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contactss',
            body: {

                "title": "Lorem ipsum dolor",
                "description": "It is a description.",
                "value": "It is a long established fact that a reader will be distrac",
                "type": 1,
                "status": 1,
                "thumbnail_url": ""
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


    it('Add Site Contact with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Lorem ipsum dolor",
                "description": "It is a description.",
                "value": "It is a long established fact that a reader will be distrac",
                "type": 1,
                "status": 1,
                "thumbnail_url": ""
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

    it('Add Site Contact with title as Upperlimit +1.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempeeeor blandit orci. Fusce odio.",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.')


        });
    });


    it('Add Site Contact with title as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.body.body.title[0]).to.eql('The title field is required.')
        });
    });



    it('Add Site Contact with title as Null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": null,
                "description": "It is a description.",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.body.body.title[0]).to.eql('The title field is required.')
        });
    });

    it('Add Site Contact with Thumbnail as invalid type', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 1,
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.thumbnail_url[0]).to.eql('The thumbnail url must end with one of the following: .jpg, .png, .jpeg.')
        });
    });

    it('Add Site Contact with Thumbnail as null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
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
            expect(response.status).to.eql(200, 'Check for validation error');
        });
    });


    it('Add Site Contact with Thumbnail as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
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
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body.title).to.eql("Cypress Automation")
            expect(response.body.body.description).to.eql("It is a description.")
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.type).to.eql(1)
            expect(response.body.body.value).to.eql('manis@gmail.com')
        });
    });


    it('Add Site Contact with description as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body.title).to.eql("Cypress Automation")
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(1)
            expect(response.body.body.type).to.eql(1)
            expect(response.body.body.value).to.eql('manis@gmail.com')
        });
    });

    it('Add Site Contact with value as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": null,
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
        });
    });

    it('Add Site Contact with value as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
        });
    });
    
    it('Add Site Contact with value as upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas @gmail",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value may not be greater than 45 characters.',
            'The value must be a valid email address.')
        });
    });
    
    it('Add Site Contact with value as invalid email address.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "manisgmail",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value must be a valid email address.')
        });
    }); 
     
    it('Add Site Contact with value as invalid phone with null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": null,
                "type": 2,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
        });
    });
    
     
    it('Add Site Contact with value as invalid phone with upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "56454643465342685324568543235241534",
                "type": 2,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value may not be greater than 20 characters.')
          
            
        });
    });

       
     
    it('Add Site Contact with value as invalid phone number', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "sadasdasdasdasdas",
                "type": 2,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value is not valid phone number.')
          
            
        });
    });
        
     
    it('Add Site Contact with value as  null phone number', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": null,
                "type": 2,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
          
            
        });
    });
        
     
    it('Add Site Contact with value as empty ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "",
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
            
        });
    });
    
        
    it('Add address with value as empty address', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "",
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
            
        });
    });
    
    
        
    it('Add address with value as null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": null,
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
            
        });
    });
    
    
        
    it('Add address with value as upperlimit+1 ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempor blandit orci. Fusce odio.",
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value may not be greater than 100 characters.')
            
        });
    });

    
        
    it('Add address with value as lowerlimit ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "4",
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'check for the error response.');
            expect(response.body.body.value[0]).to.eql('The address can not be only numeric')
            
        });
    });
    
        
    it('Add address with value as upperlimit ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat felis eu tellus blandit dui.",
                "type": 4,
                "status": 1,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'check for the success response.');
            
        });
    });


    

    it('Add Site Contact with the status as published.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 1,
                "thumbnail_url": null
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
   
    it('Add Site Contact with the status as Unpublished.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/contacts',
            body: {

                "title": "Cypress Automation",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
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
            expect(response.status).to.eql(200, 'Check for validation error');
            expect(response.body.body.status).to.eql(2)
        });
    });
   
   
   
});

