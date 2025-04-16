import { baseConfig } from "../../../../../fixtures/baseConfig";
let contactId;
let contactId1;

describe('Edit Global Contact', () => {
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
        console.log('Create the Another Contact as well.')
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
                const contactId1 = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, contactId1 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            contactId = data.contactId
            contactId1 = data.contactId1
        });
    });

    it('Edit Contact with Invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contactsss/asda',
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

    it('Edit Contacts with Invalid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/contactss/sadasd',
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

    it('Edit contact with title as upperlimit+1 ', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        id: contactId,
                        title: "Lorem  orci. FuscLorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.e odio.",
                        description: "It is a description.",
                        value: "manis@gmail.com ",
                        type: 1,
                        status: 2

                    }
                ]
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
           
            expect(response.body.body).to.have.property('data.0.title');
            expect(response.body.body['data.0.title']).to.eql(['The data.0.title may not be greater than 255 characters.']);


        });
    });




    it('Edit contact with title as empty ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,

                        "title": "",
                        "description": "It is a description.",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
        });
    });




    it('Edit contact with title as null ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,

                        "title": null,
                        "description": "It is a description.",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
        });
    });



    it('Edit contact with thumbnail as invalid type ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "It is a description.",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 2,
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/contacts/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.thumbnail_url"]).to.eql([
                "The data.0.thumbnail_url must end with one of the following: .jpg, .png, .jpeg."
            ]);
        });
    });


    it('Edit contact with thumbnail as empty ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation Edited",
                        "description": "It is a edited description.",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
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



    it('Edit contact with description as empty ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation Edited",
                        "description": "",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for success status');
            expect(response.body.body['data.0.description']).to.eql([
                "The data.0.description field is required."
            ]);

        });
    });



    it('Edit contact with value as null ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "",
                        "value": null,
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.']);
        });
    });



    it('Edit contact with value as empty ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,

                        "title": "Cypress Automation Edited",
                        "description": "",
                        "value": "",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.']);
        });
    });

    it('Edit contact with value as upperlimit+1 ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,

                        "title": "Cypress Automation",
                        "description": "",
                        "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas @gmail",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql([
                "The data.0.value may not be greater than 45 characters.",
                "The data.0.value must be a valid email address."
            ])
        });
    });


    it('Edit contact with value as invalid email address ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,

                        "title": "Cypress Automation",
                        "description": "",
                        "value": "manisgmail",
                        "type": 1,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value must be a valid email address.']);
        });
    });

    it('Edit contact with value as invalid phone with null ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,


                        "title": "Cypress Automation",
                        "description": "",
                        "value": null,
                        "type": 2,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.']);
        });
    });


    it('Edit contact with value as invalid phone with upperlimit+1 ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,



                        "title": "Cypress Automation",
                        "description": "",
                        "value": "56454643465342685324568543235241534",
                        "type": 2,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql( [
                "The data.0.value may not be greater than 20 characters."
            ])
        });
    });


    it('Edit contact with value as invalid phone number ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "",
                        "value": "sadasdasdasdasdas",
                        "type": 2,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value is not valid phone number.'])
        });
    });


    it('Edit contact with value as null phone number ', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "",
                        "value": null,
                        "type": 2,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.'])

        });
    });


    it('Edit contact with value as empty', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "",
                        "value": "",
                        "type": 4,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.'])

        });
    });


    it('Edit contact with adress value as null', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "",
                        "value": null,
                        "type": 4,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.'])

        });
    });

    it('Edit contact with adress value as upperlimit+1', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation",
                        "description": "",
                        "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempor blandit orci. Fusce odio.",
                        "type": 4,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body['data.0.value']).to.eql(['The data.0.value may not be greater than 100 characters.'])

        });
    });


    it('Edit contact with address value as lowerlimit', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation Edited",
                        "description": "",
                        "value": "4",
                        "type": 4,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'check for the error response.');
            expect(response.body.body['data.0.value']).to.eql([
                "The data.0.value format is invalid."
            ]);
        });
    });

    it('Edit contact with adress value as upperlimit', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation Edited",
                        "description": "Empty",
                        "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat felis eu tellus blandit dui.",
                        "type": 4,
                        "status": 1,
                        "thumbnail_url": null
                    }
                ]
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



    it('Edit contact with with the status as published', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation Edited",
                        "description": "It is a description.",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 2,
                        "thumbnail_url": null
                    }
                ]
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


    it('Edit contact with with the status as published', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/contacts/multiple',
            body: {
                "data": [
                    {
                        "id": contactId,
                        "title": "Cypress Automation Edited",
                        "description": "It is a description.",
                        "value": "manis@gmail.com ",
                        "type": 1,
                        "status": 2,
                        "thumbnail_url": null
                    }
                ]
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
        //////////////////////////////

        it('Edit contact with contact 1 and 2 title as upperlimit+1 ', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            id: contactId,
                            title: "Lorem  orci. FuscLorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.e odio.",
                            description: "It is a description.",
                            value: "manis@gmail.com ",
                            type: 1,
                            status: 2
    
                        },{
                            id: contactId1,
                            title: "Lorem  orci. FuscLorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.Lorem  orci. Fusce odio.e odio.",
                            description: "It is a description.",
                            value: "manis@gmail.com ",
                            type: 1,
                            status: 2
    
                        }
                    ]
                },
    
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
               
                expect(response.body.body).to.have.property('data.0.title');
                expect(response.body.body['data.0.title']).to.eql(['The data.0.title may not be greater than 255 characters.']);
                expect(response.body.body['data.1.title']).to.eql(['The data.1.title may not be greater than 255 characters.']);
    
    
            });
        });
    
    
    
    
        it('Edit contact 1 and 2 with title as empty ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                                "title": "",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                                "title": "",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
                expect(response.body.body["data.1.title"]).to.eql(['The data.1.title field is required.']);
            });
        });
    
    
    
    
        it('Edit contact with title as null ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": null,
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                                "title": null,
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
                expect(response.body.body["data.1.title"]).to.eql(['The data.1.title field is required.']);
            });
        });
    
    
    
        it('Edit Contact 1 and 2 with thumbnail as invalid type ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 2,
                            "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/contacts/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb"
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 2,
                            "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/contacts/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb"
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body["data.0.thumbnail_url"]).to.eql([
                    "The data.0.thumbnail_url must end with one of the following: .jpg, .png, .jpeg."
                ]);
                expect(response.body.body["data.1.thumbnail_url"]).to.eql([
                    "The data.1.thumbnail_url must end with one of the following: .jpg, .png, .jpeg."
                ]);
            });
        });
    
    
        it('Edit Contact 1 and 2 with thumbnail as empty ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation Edited",
                            "description": "It is a edited description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation Edited",
                            "description": "It is a edited description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
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
    
    
    
        it('Edit Contact 1 and 2 with description as empty ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation Edited",
                            "description": "",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation Edited",
                            "description": "",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for success status');
                expect(response.body.body['data.0.description']).to.eql([
                    "The data.0.description field is required."
                ]);
                expect(response.body.body['data.1.description']).to.eql([
                    "The data.1.description field is required."
                ]);
    
            });
        });
    
    
    
        it('Edit Contact 1 and 2 with value as null ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.']);
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value field is required.']);
            });
        });
    
    
    
        it('Edit Contact 1 and 2 with value as empty ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
    
                            "title": "Cypress Automation Edited",
                            "description": "",
                            "value": "",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
    
                            "title": "Cypress Automation Edited",
                            "description": "",
                            "value": "",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.']);
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value field is required.']);
            });
        });
    
        it('Edit Contact 1 and 2 with value as upperlimit+1 ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
    
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas @gmail",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
    
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas @gmail",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql([
                    "The data.0.value may not be greater than 45 characters.",
                    "The data.0.value must be a valid email address."
                ])
                expect(response.body.body['data.1.value']).to.eql([
                    "The data.1.value may not be greater than 45 characters.",
                    "The data.1.value must be a valid email address."
                ])
            });
        });
    
    
        it('Edit Contact 1 and 2 with value as invalid email address ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "manisgmail",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "manisgmail",
                            "type": 1,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value must be a valid email address.']);
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value must be a valid email address.']);
            });
        });
    
        it('Edit Contact 1 and 2 with value as invalid phone with null ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value field is required.']);
            });
        });
    
    
        it('Edit Contact 1 and 2 with value as invalid phone with upperlimit+1 ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,    
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "56454643465342685324568543235241534",
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,    
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "56454643465342685324568543235241534",
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql( [
                    "The data.0.value may not be greater than 20 characters."
                ])
                expect(response.body.body['data.1.value']).to.eql( [
                    "The data.1.value may not be greater than 20 characters."
                ])
            });
        });
    
    
        it('Edit Contact 1 and 2 with value as invalid phone number ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "sadasdasdasdasdas",
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "sadasdasdasdasdas",
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value is not valid phone number.'])
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value is not valid phone number.'])
            });
        });
    
    
        it('Edit Contact 1 and 2 with value as null phone number ', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 2,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.'])
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value field is required.'])
    
            });
        });
    
    
        it('Edit Contact 1 and 2 with value as empty', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.'])
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value field is required.'])
    
            });
        });
    
    
        it('Edit Contact 1 and 2 with adress value as null', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": null,
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value field is required.'])
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value field is required.'])
    
            });
        });
    
        it('Edit Contact 1 and 2 with adress value as upperlimit+1', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempor blandit orci. Fusce odio.",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation",
                            "description": "",
                            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam magna ut ex blandit, in sollicitudin tellus viverra. Phasellus sit amet ante dui. Aenean vestibulum vel quam ut pellentesque. Nunc eu ultrices urna, tempor blandit orci. Fusce odio.",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body['data.0.value']).to.eql(['The data.0.value may not be greater than 100 characters.'])
                expect(response.body.body['data.1.value']).to.eql(['The data.1.value may not be greater than 100 characters.'])
    
            });
        });
    
    
        it('Edit Contact 1 and 2 with address value as lowerlimit', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation Edited",
                            "description": "",
                            "value": "4",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        },{
                            "id": contactId1,
                            "title": "Cypress Automation Edited",
                            "description": "",
                            "value": "4",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'check for the error response.');
                expect(response.body.body['data.1.value']).to.eql([
                    "The data.1.value format is invalid."
                ]);
            });
        });
    
        it('Edit Contact 1 and 2 with adress value as upperlimit', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation Edited",
                            "description": "Empty",
                            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat felis eu tellus blandit dui.",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation Edited",
                            "description": "Empty",
                            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat felis eu tellus blandit dui.",
                            "type": 4,
                            "status": 1,
                            "thumbnail_url": null
                        }
                    ]
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
    
    
    
        it('Edit Contact 1 and 2 with with the status as published', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation Edited",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 2,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation Edited",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 2,
                            "thumbnail_url": null
                        }
                    ]
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
    
    
        it('Edit contact 1 and 2 with with the status as published', () => {
    
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/contacts/multiple',
                body: {
                    "data": [
                        {
                            "id": contactId,
                            "title": "Cypress Automation Edited",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 2,
                            "thumbnail_url": null
                        },
                        {
                            "id": contactId1,
                            "title": "Cypress Automation Edited",
                            "description": "It is a description.",
                            "value": "manis@gmail.com ",
                            "type": 1,
                            "status": 2,
                            "thumbnail_url": null
                        }
                    ]
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

        it('Edit  contact with contact with All read Permission', () => {

            cy.request({
                method: 'POST',
                url: baseConfig.authUrl,
                body: {
                    "username": "samundra@mail.com",
                    "password": "1!passworD"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessTokenReadPermission', response.body.body.access_token); // Store token in Cypress.env
    
            });
            cy.then(() => {
                const accessTokenReadPermission = Cypress.env('accessTokenReadPermission');
    
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/contacts/multiple',
                    body: {
                        "data": [
                            {
                                "id": contactId,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            },
                            {
                                "id": contactId1,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            }
                        ]
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenReadPermission}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(403, 'Check for status of contacts');
                    expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");
                });
            });
        });
    
    
        it('Edit  contact with contact with MasterAdmin Permission', () => {
    
            cy.request({
                method: 'POST',
                url: baseConfig.authUrl,
                body: baseConfig.masterPermissionBody,
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessTokenMasterAdmin', response.body.body.access_token); // Store token in Cypress.env
    
            });
            cy.then(() => {
                const accessTokenMasterAdmin = Cypress.env('accessTokenMasterAdmin');
    
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/contacts/multiple',
                    body: {
                        "data": [
                            {
                                "id": contactId,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            },
                            {
                                "id": contactId1,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            }
                        ]
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenMasterAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of contacts');
                });
            });
        });
    
        it('Edit  contact with contact with Site Admin Permission', () => {
    
            cy.request({
                method: 'POST',
                url: baseConfig.authUrl,
                body: baseConfig.SiteAdminPermission358,
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessTokenSiteAdmin', response.body.body.access_token); // Store token in Cypress.env
    
            });
            cy.then(() => {
                const accessTokenSiteAdmin = Cypress.env('accessTokenSiteAdmin');
    
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/contacts/multiple',
                    body: {
                        "data": [
                            {
                                "id": contactId,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            },
                            {
                                "id": contactId1,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            }
                        ]
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenSiteAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(403, 'Check for status of contacts');
                    expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");
    
                });
            });
        });
    
        it('Edit  contact with contact with Global Resource CRUD Permission', () => {
    
            cy.request({
                method: 'POST',
                url: baseConfig.authUrl,
                body: baseConfig.GlobalResourceCRUD,
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessTokenGlobalResourceCRUD', response.body.body.access_token); // Store token in Cypress.env
    
            });
            cy.then(() => {
                const accessTokenGlobalResourceCRUD = Cypress.env('accessTokenGlobalResourceCRUD');
    
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/contacts/multiple',
                    body: {
                        "data": [
                            {
                                "id": contactId,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            },
                            {
                                "id": contactId1,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            }
                        ]
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of contacts');
    
                });
            });
            it('Edit  contact with contact with Reseller Admin Permission', () => {
    
            cy.request({
                method: 'POST',
                url: baseConfig.authUrl,
                body: baseConfig.ResellerAdminPermission,
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env
    
            });
            cy.then(() => {
                const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
                cy.request({
                    method: 'GET',
                    url: baseConfig.baseUrl + '/contacts',
                    qs:{
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenResellerAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eql(200, 'Check for Success Status');
                    expect(response.body.body.data[0]).to.have.property('id');
                    const resellercontact1 = response.body.body.data[0].id;
                    const resellercontact2 = response.body.body.data[1].id;
    
                    cy.readFile('cypress/fixtures/variables.json').then((data) => {
                        const updatedData = { ...data, documentId1, documentId2 };
                        cy.writeFile('cypress/fixtures/variables.json', updatedData);
                    });
                });
            });
                cy.log("Read The variables")
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    resellercontact1 = data.resellercontact1
                    resellercontact2 = data.resellercontact2
                });
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/contacts/multiple',
                    body: {
                        "data": [
                            {
                                "id": contactId,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            },
                            {
                                "id": contactId1,
                                "title": "Cypress Automation Edited",
                                "description": "It is a description.",
                                "value": "manis@gmail.com ",
                                "type": 1,
                                "status": 2,
                                "thumbnail_url": null
                            }
                        ]
                    },
                    qs:{
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenResellerAdmin}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of contacts');
    
                });
            });
        });
});

