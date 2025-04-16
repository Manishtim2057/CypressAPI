import { baseConfig } from "../../../../fixtures/baseConfig";
describe('Config Contacts', () => {

    let contactForConfig;
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
            contactForConfig = data.contactForConfig
        });
    });

    it('1 Config Contact with Invalid api and valid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({            
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss',
            body: {
                "title": "Configured Contact",
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "reseller_contact_id": contactForConfig
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
                "reseller_contact_id": contactForConfig
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
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Configured Contact",
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "reseller_contact_id": contactForConfig
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

    it('4 Configured Contact with Title as null', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": null,
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "reseller_contact_id": contactForConfig
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
    });

    it('5 Configured Contact with Title as upperlimit+1.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "reseller_contact_id": contactForConfig
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


    it('6 Configured Contact with as thumbnailUrl as invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Configured Contact",
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
                "reseller_contact_id": contactForConfig
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


    it('Configured contact with as description as Null.', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Cypress Configured image",
                "description": null,
                "thumbnail_url": "",
                "contact_id": contactForConfig
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body.title).to.eql('Cypress Configured image')
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.thumbnail_url).to.eql(null);

        });

    });

    it('9 Configured Contact with all field as Valid', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Configured Contact",
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "contact_id": contactForConfig
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(409, 'Check for success Status');
        });

    });


    it('10 Configured Contact with all field as Valid', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Configured Contact",
                "description": "This is an Configured contact description.",
                "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                "contact_id": contactForConfig
            }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(409, 'Check for error Status');
            expect(response.body.status.message).to.be.eql('Contact already configured.')

        });
    })
/*
    it('11 Config Contact with Invalid api and valid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');


            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
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
    });


    it('12 Config Contact with Invalid api and Invalid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
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

    });

    it('13 Config Contact with valid api and Invalid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + baseConfig.contact_config_id,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
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
    });

    it('14 Edit Configured Contact with Title as null', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + baseConfig.contact_config_id,
                body: {
                    "title": null,
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
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

    });

    it('15 Edit Configured Contact with Title as upperlimit+1.', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + baseConfig.contact_config_id,
                body: {
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ipsum arcu, porttitor ut mollis a, vestibulum vitae tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ultricies, nunc at mattis varius, eros ac.",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
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
    });


    it('16 Edit Configured Contact with Title as lowerlimit.', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                body: {
                    "title": "L",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                expect(response.body.body.title).to.eql('L');
                expect(response.body.body.description).to.eql('This is an Configured contact description.');
                expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png')
            });
        });


    });

    it('17 Edit Configured Contact with as thumbnailUrl as invalid.', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
                    "reseller_contact_id": contactIdForConfig
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

    });

    it('18 Edit Configured Contact with as description as Null.', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                body: {
                    "title": "Configured link",
                    "description": null,
                    "thumbnail_url": null,
                    "reseller_contact_id": contactIdForConfig
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for error status');
                expect(response.body.body.description[0]).to.eql("The description field is required.")

            });
        });
    });
    it('19 Edit Configured Contact with as thumbnailUrl as null.', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": null,
                    "reseller_contact_id": contactIdForConfig
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
    });


    it('20 Edit Configured Contact with as contact as Null.', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": null
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(417, 'Check for validation error');
                expect(response.body.body.reseller_contact_id[0]).to.eql('The reseller contact id field is required.');
            });
        });
    });


    it('21 Edit Configured Contact with all field as Valid', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' +contactIdForConfig,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');
                expect(response.body.body.title).to.eql('Configured Contact');
                expect(response.body.body.description).to.eql('This is an Configured contact description.');
                expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png')
            });
        });
    });

    it('22 Config Contact List with Invalid api and valid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');


            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
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
    });


    it('23 Config Contact List with Invalid api and Invalid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": 5
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
    });


    it('24 Config Contact List with valid api and Invalid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": 5
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
    });




    it('25 Config Contact List with valid api and valid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.png",
                    "reseller_contact_id": contactIdForConfig
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success Status');

            });
        });

    });
    it('26 Config Contact Details with Invalid api and valid Method', () => {
 cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            const contactIdForConfig= data.contactIdForConfig
        const accessToken = Cypress.env('accessToken');


            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss' + baseConfig.contactId,
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


        it('27 Config Contact Details with Invalid api and Invalid Method', () => {
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                const contactId = data.contactId
                cy.request({
                    method: 'POST',
                    url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss' + baseConfig.contactId,
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
        });


        it('28 Config Contact Details with valid api and Invalid Method', () => {
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                const contactId = data.contactId
                cy.request({
                    method: 'POST',
                    url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
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
        });



        it('29 Config Contact Details with valid api and valid Method', () => {
            cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                const contactId = data.contactId
                cy.request({
                    method: 'GET',
                    url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Login Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for success Status');

                });
            });
            it('30 Delete Global Contact with Invalid api and Valid method', () => {
                cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                    const contactId = data.contactId
                    cy.request({
                        method: 'DELETE',
                        url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contasct-config',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,

                        },
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eql(404, 'Check for Not found error');
                        expect(response.body.status).to.have.property('message');
                        expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

                    });
                })
            });


            it('31 Delete Global Contact with valid api and InValid method', () => {
                cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                    const contactId = data.contactId

                    cy.request({
                        method: 'POST',
                        url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config/' + contactIdForConfig,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,

                        },
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
                        expect(response.body.status).to.have.property('message');
                        expect(response.body.status.message).to.be.eql('Invalid method call.');
                    });
                });
            });
            it('32 Delete Global Contact with Invalid api and InValid method', () => {
                cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                    const contactId = data.contactId

                    cy.request({
                        method: 'DELETE',
                        url: baseConfig.baseUrl + '/sitess/' + baseConfig.siteId + '/contact-config',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,

                        },
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eql(404, 'Check for Not found error');
                        expect(response.body.status).to.have.property('message');
                        expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

                    });
                });
            });

            it('33 Delete Global Contact with Valid api and Valid method', () => {
                cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
                    const contactId = data.contactId

                    cy.request({
                        method: 'DELETE',
                        url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-configsss/' + contactIdForConfig,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,

                        },
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eql(200, 'Check for Success Status');

                    });
                });

            });

        });
    });*/
});
