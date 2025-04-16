import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Edit Config Contacts', () => {
    let config_contacts;
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
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                const config_contacts = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, config_contacts };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Create the Global Contact.')
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
                const contactForConfig = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, contactForConfig };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });

        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
             config_contacts = data.config_contacts
        });
    });


   
        it('1 Config Contact with Invalid api and valid Method', () => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-coasdnfigsss/asdasdasd',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
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


        it('2 Config Contact with Invalid api and Invalid Method', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
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


        it('3 Config Contact with valid api and Invalid Method', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
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

        it('4 Edit Configured Contact with Title as null', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                body: {
                    "title": null,
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
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

        it('5 Edit Configured Contact with Title as upperlimit+1.', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                body: {
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
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
        });


        it('6 Edit Configured Contact with Title as lowerlimit.', () => {
            const accessToken = Cypress.env('accessToken');
          
                cy.request({
                    method: 'PUT',
                    url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                    body: {
                        "title": "Edited Config Contacts",
                        "description": "This is an Configured contact description.",
                        "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Login Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for success Status');
                    expect(response.body.body.title).to.eql('Edited Config Contacts');
                    expect(response.body.body.description).to.eql('This is an Configured contact description.');
                    expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png')
                });
            
        });



        it('7 Edit Configured Contact with as thumbnailUrl as invalid.', () => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                body: {
                    "title": "Edited Config Contacts",
                    "description": "This is an Configured contact description.",
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



        it('Edit Configured Contact with as description as Null.', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' +config_contacts,
                body: {
                    "title": "Edited Config Contacts",
                    "description": null,
                    "thumbnail_url": null,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for error status');
                expect(response.body.body.description).to.eql(null)

            });
        });
        it('8 Edit Configured Contact with as thumbnailUrl as null.', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                body: {
                    "title": "Edited Config Contacts",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": null,
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



        it('10 Edit Configured Contact with all field as Valid', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + config_contacts,
                body: {
                    "title": "Edited Config Contacts",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                expect(response.body.body.title).to.eql('Edited Config Contacts');
                expect(response.body.body.description).to.eql('This is an Configured contact description.');
                expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png')
            });
        });
    });
