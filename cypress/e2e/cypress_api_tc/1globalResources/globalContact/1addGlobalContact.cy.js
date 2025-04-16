import { baseConfig } from "../../../../fixtures/baseConfig";describe('Add global contact', () => {
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


    it('Add contact with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contactss',
            body: {

                "title": "Lorem ipsum dolor",
                "description": "It is a description.",
                "value": "It is a long established fact that a reader will be distrac",
                "type": 1,
                "status": 2,
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


    it('Add contact with Invalid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contactss',
            body: {

                "title": "Lorem ipsum dolor",
                "description": "It is a description.",
                "value": "It is a long established fact that a reader will be distrac",
                "type": 1,
                "status": 2,
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


    it('Add contact with valid api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "It is a description.",
                "value": "It is a long established fact that a reader will be distrac",
                "type": 1,
                "status": 2,
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

    it('Add contact with title as Upperlimit +1.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempeeeor blandit orci. Fusce odio.",
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
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.')


        });
    });


    it('Add contact with title as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "",
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
            expect(response.body.body.title[0]).to.eql('The title field is required.')
        });
    });



    it('Add contact with title as Null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": null,
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
            expect(response.body.body.title[0]).to.eql('The title field is required.')
        });
    });

    it('Add contact with Thumbnail as invalid type', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "It is a description.",
                "value": "manis@gmail.com ",
                "type": 1,
                "status": 2,
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

    it('Add contact with Thumbnail as null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
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


    it('Add contact with Thumbnail as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
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
            expect(response.body.body.title).to.eql("Cypress Automation Test")
            expect(response.body.body.description).to.eql("It is a description.")
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.type).to.eql(1)
            expect(response.body.body.value).to.eql('manis@gmail.com')
        });
    });


    it('Add contact with description as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
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
            expect(response.body.body.title).to.eql("Cypress Automation Test")
            expect(response.body.body.description).to.eql(null)
            expect(response.body.body.thumbnail_url).to.eql(null)
            expect(response.body.body.status).to.eql(2)
            expect(response.body.body.type).to.eql(1)
            expect(response.body.body.value).to.eql('manis@gmail.com')
            const docId = response.body.body.id;
            Cypress.env('id', docId)
        });
    });

    it('Add contact with value as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": null,
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
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
        });
    });

    it('Add contact with value as empty', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "",
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
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value field is required.')
        });
    });

    it('Add contact with value as upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas @gmail",
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
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value may not be greater than 45 characters.',
                'The value must be a valid email address.')
        });
    });

    it('Add contact with value as invalid email address.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "manisgmail",
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
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body.value[0]).to.eql('The value must be a valid email address.')
        });
    });

    it('Add contact with value as invalid phone with null', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": null,
                "type": 2,
                "status": 2,
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


    it('Add contact with value as invalid phone with upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "56454643465342685324568543235241534",
                "type": 2,
                "status": 2,
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



    it('Add contact with value as invalid phone number', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "sadasdasdasdasdas",
                "type": 2,
                "status": 2,
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


    it('Add contact with value as  null phone number', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": null,
                "type": 2,
                "status": 2,
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


    it('Add contact with value as empty ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "",
                "type": 4,
                "status": 2,
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
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "",
                "type": 4,
                "status": 2,
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
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": null,
                "type": 4,
                "status": 2,
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
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempor blandit orci. Fusce odio.",
                "type": 4,
                "status": 2,
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
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
                "description": "",
                "value": "4",
                "type": 4,
                "status": 2,
                "thumbnail_url": null
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'check for the errpr response.');
            expect(response.body.body.value[0]).to.eql('The address can not be only numeric')

        });
    });


    it('Add address with value as upperlimit ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress AutomAutomation TestAutomation TestAutomation TestAutomation TestAutomation TestAutomation TestAutomation TestAutomation TestAutomation TestAutomation Testation Test",
                "description": "",
                "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat felis eu tellus blandit dui.",
                "type": 4,
                "status": 2,
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

    it('Add contact with the status as published.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contacts',
            body: {

                "title": "Cypress Automation Test",
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
            cy.log('Add Contact Response:', JSON.stringify(response));

            // Verify response status
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'check for the success response.');
            expect(response.body.body).to.have.property('id');
            const contactId = response.body.body.id;
            cy.writeFile('cypress\\fixtures\\variables.json', { contactId });
        });
    });

    it('Add contact with the status as Unpublished.', () => {
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
});

