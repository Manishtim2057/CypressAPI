import { baseConfig } from "../../../fixtures/baseConfig";
describe('Select Document resources In-Video Recommendation', () => {
    let documentId;
    let resellerDocumentId;
    let siteDocumentId;
    let configuredDocumentId;

    before('Login With SuperUser permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.superadminPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response', JSON.stringify(response));
            expect(response.status).to.be.eql(200);
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url: `${baseConfig.baseUrl}/documents`,
                method: "POST",
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
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Document Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Document')
                const documentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                documentId = data.documentId;
            })
        });
        cy.then('Configured the Global Document', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
                body: {
                    "title": "Configured Document",
                    "description": null,
                    "thumbnail_url": null,
                    "document_id": documentId,
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
                expect(response.body.body).to.have.property('id');
                configuredDocumentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, configuredDocumentId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });


        cy.then('Create the Site Document', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/documents',
                body: {
                    "title": "Cypress Automation Site Resources",
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
                expect(response.body.body.title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
                expect(response.body.body).to.have.property('id');
                siteDocumentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteDocumentId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData)
                })
            })
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                documentId = data.documentId;
                configuredDocumentId = data.configuredDocumentId;
                siteDocumentId = data.siteDocumentId
            })
        })
    })



    it('Add Global Resource to the In-video recommendation with Invalid Api and Valid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videoss/${baseConfig.videoId}/recommendations/multiple/undefined`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": documentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        });
    });
    it('Add Global Resource to the In-video recommendation with Valid Api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "POST",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": documentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(405);
            expect(response.body.status.message).to.eql('Invalid method call.')
        });
    })
    it('Add Global Resource to the In-video recommendation with Invalid Api and Invalid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videoss/${baseConfig.videoId}/recommendations/multiple/undefined`,
            method: "POST",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": documentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        });
    })

    it('Add Global Resources to the In-video recommendations with Valid Api And Valid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": documentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(200);
            // expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        });

    })

    it('Add Configured Resources to the In-video recommendations with Valid Api And Valid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Configured Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": configuredDocumentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.data[0].title).to.eql('Configured Resources');
            expect(response.body.body.data[0].label).to.eql('Resource Label');
            expect(response.body.body.data[0].status).to.eql(2);
            expect(response.body.body.data[0].pause).to.eql(1);
            expect(response.body.body.data[0].type).to.eql('resources');
            expect(response.body.body.data[0].seconds).to.eql(null);
            expect(response.body.body.data[0].time).to.eql("00:00:56");
            expect(response.body.body.data[0].order).to.eql(2);
            expect(response.body.body.data[0].resource_type).to.eql('GlobalDocument');
            expect(response.body.body.data[0].resource.id).to.eql(configuredDocumentId);
            expect(response.body.body.data[0].resource.title).to.eql('Configured Document');
            expect(response.body.body.data[0].resource.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.data[0].resource.description).to.eql(null);
            expect(response.body.body.data[0].resource.thumbnail_url).to.eql(null);
            expect(response.body.body.data[0].resource.status).to.eql(2);

        })
    });
    it('Add Site Resources to the In-video recommendations with Valid Api And Valid Method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Site Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": siteDocumentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.data[0].title).to.eql('Site Resources');
            expect(response.body.body.data[0].label).to.eql('Resource Label');
            expect(response.body.body.data[0].status).to.eql(2);
            expect(response.body.body.data[0].pause).to.eql(1);
            expect(response.body.body.data[0].type).to.eql('resources');
            expect(response.body.body.data[0].seconds).to.eql(null);
            expect(response.body.body.data[0].time).to.eql("00:00:56");
            expect(response.body.body.data[0].order).to.eql(2);
            expect(response.body.body.data[0].resource_type).to.eql('GlobalDocument');
            expect(response.body.body.data[0].resource.id).to.eql(siteDocumentId);
            expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation Site Resources');
            expect(response.body.body.data[0].resource.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.data[0].resource.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.data[0].resource.thumbnail_url).to.eql(baseConfig.pngImage);
            expect(response.body.body.data[0].resource.status).to.eql(2);

        })
    });

    it('Add Global Resources to the In-video recommendations with resources Id as String or Alphaneumeric.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": "1documentId",
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(417);
            expect(response.body.body['suggestions.0.resources.0.resource_id']).to.eql([
                "The suggestions.0.resources.0.resource_id must be an integer."
            ]);


        })
    });
    it('Add Global Resources to the In-video recommendations with resources Id as invalid Integer.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": 5645324,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')

        })
    });

    it('Add Global Resources to the In-video recommendations with resources type as Invalid', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": documentId,
                                "resource_type": "Thisis",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(417);
            expect(response.body.body['suggestions.0.resources.0.resource_type']).to.eql([
                "The selected suggestions.0.resources.0.resource_type is invalid."
            ]);



        })
    });

    it('Add Global Resources to the In-video recommendations with resources order as String', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": [
                    {
                        "time": "00:00:56",
                        "title": "Global Resources",
                        "pause": true,
                        "label": "Resource Label",
                        "status": 2,
                        "seconds": null,
                        "type": "resources",
                        "resources": [
                            {
                                "resource_id": documentId,
                                "resource_type": "GlobalDocument",
                                "order": "This"
                            }
                        ]
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Global Resource', JSON.stringify(response));
            expect(response.status).to.eql(417);
            expect(response.body.body['suggestions.0.resources.0.order']).to.eql([
                "The suggestions.0.resources.0.order must be an integer."
            ]);
        })
    });


    it('Add Global Resources to the In-video recommendations with All read Permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.siteReadPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenReadPermission', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then('Request for assigning the resource on in-video Recommendation', () => {
            const accessTokenReadPermission = Cypress.env('accessTokenReadPermission');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
                method: "PUT",
                body: {
                    "suggestions": [
                        {
                            "time": "00:00:56",
                            "title": "Global Resources",
                            "pause": true,
                            "label": "Resource Label",
                            "status": 2,
                            "seconds": null,
                            "type": "resources",
                            "resources": [
                                {
                                    "resource_id": documentId,
                                    "resource_type": "GlobalDocument",
                                    "order": 2
                                }
                            ]
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Resource', JSON.stringify(response));
                expect(response.status).to.eql(403);
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.")


            });
        });
    });
    it('Add Global Resources to the In-video recommendations with Masteradmin Permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.masterPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenMasterAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then('Request for assigning the resource on in-video Recommendation', () => {
            const accessTokenMasterAdmin = Cypress.env('accessTokenMasterAdmin');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
                method: "PUT",
                body: {
                    "suggestions": [
                        {
                            "time": "00:00:56",
                            "title": "Site Resources",
                            "pause": true,
                            "label": "Resource Label",
                            "status": 2,
                            "seconds": null,
                            "type": "resources",
                            "resources": [
                                {
                                    "resource_id": siteDocumentId,
                                    "resource_type": "GlobalDocument",
                                    "order": 2
                                }
                            ]
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Resource', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.data[0].title).to.eql('Site Resources');
                expect(response.body.body.data[0].label).to.eql('Resource Label');
                expect(response.body.body.data[0].status).to.eql(2);
                expect(response.body.body.data[0].pause).to.eql(1);
                expect(response.body.body.data[0].type).to.eql('resources');
                expect(response.body.body.data[0].seconds).to.eql(null);
                expect(response.body.body.data[0].time).to.eql("00:00:56");
                expect(response.body.body.data[0].order).to.eql(2);
                expect(response.body.body.data[0].resource_type).to.eql('GlobalDocument');
                expect(response.body.body.data[0].resource.id).to.eql(siteDocumentId);
                expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.data[0].resource.url).to.eql(baseConfig.pdfDocument);
                expect(response.body.body.data[0].resource.description).to.eql('This is an Description for Documents.');
                expect(response.body.body.data[0].resource.thumbnail_url).to.eql(baseConfig.pngImage);
                expect(response.body.body.data[0].resource.status).to.eql(2);
            })
        });
    });

    it('Add Global Resources to the In-video recommendations with Site Admin Permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.SiteAdminPermission358,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenSiteAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then('Request for assigning the resource on in-video Recommendation with Site Admin permission.', () => {
            const accessTokenSiteAdmin = Cypress.env('accessTokenSiteAdmin');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
                method: "PUT",
                body: {
                    "suggestions": [
                        {
                            "time": "00:00:56",
                            "title": "Site Resources",
                            "pause": true,
                            "label": "Resource Label",
                            "status": 2,
                            "seconds": null,
                            "type": "resources",
                            "resources": [
                                {
                                    "resource_id": siteDocumentId,
                                    "resource_type": "GlobalDocument",
                                    "order": 2
                                }
                            ]
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Resource', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.data[0].title).to.eql('Site Resources');
                expect(response.body.body.data[0].label).to.eql('Resource Label');
                expect(response.body.body.data[0].status).to.eql(2);
                expect(response.body.body.data[0].pause).to.eql(1);
                expect(response.body.body.data[0].type).to.eql('resources');
                expect(response.body.body.data[0].seconds).to.eql(null);
                expect(response.body.body.data[0].time).to.eql("00:00:56");
                expect(response.body.body.data[0].order).to.eql(2);
                expect(response.body.body.data[0].resource_type).to.eql('GlobalDocument');
                expect(response.body.body.data[0].resource.id).to.eql(siteDocumentId);
                expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.data[0].resource.url).to.eql(baseConfig.pdfDocument);
                expect(response.body.body.data[0].resource.description).to.eql('This is an Description for Documents.');
                expect(response.body.body.data[0].resource.thumbnail_url).to.eql(baseConfig.pngImage);
                expect(response.body.body.data[0].resource.status).to.eql(2);
            })
        });
    });

    it('Add Global Resources to the In-video recommendations with Global CRUD Permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.GlobalResourceCRUD,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenGlobalResourceCRUD', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then('Request for assigning the resource on in-video Recommendation', () => {
            const accessTokenGlobalResourceCRUD = Cypress.env('accessTokenGlobalResourceCRUD');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
                method: "PUT",
                body: {
                    "suggestions": [
                        {
                            "time": "00:00:56",
                            "title": "Global Resources",
                            "pause": true,
                            "label": "Resource Label",
                            "status": 2,
                            "seconds": null,
                            "type": "resources",
                            "resources": [
                                {
                                    "resource_id": documentId,
                                    "resource_type": "GlobalDocument",
                                    "order": 2
                                }
                            ]
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Resource', JSON.stringify(response));
                expect(response.status).to.eql(403);
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.")

            })
        })
    });

    it('Add Global Resources to the In-video recommendations with Reseller Admin Permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.ResellerAdminPermission,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then('Create the Document On reseller', () => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents`,
                method: "POST",
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
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Document Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Document')
                expect(response.body.body).to.have.property('id');
                resellerDocumentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, resellerDocumentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    resellerDocumentId = data.resellerDocumentId;
                });
            });
            cy.then('Add resources to in-Video Recommendations.', () => {
                const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
                cy.request({
                    url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
                    method: "PUT",
                    body: {
                        "suggestions": [
                            {
                                "time": "00:00:32",
                                "title": "Global Resources",
                                "pause": true,
                                "label": "Resource Label",
                                "status": 2,
                                "seconds": null,
                                "type": "resources",
                                "resources": [
                                    {
                                        "resource_id": resellerDocumentId,
                                        "resource_type": "GlobalDocument",
                                        "order": 2
                                    }
                                ]
                            }
                        ]
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenResellerAdmin}`,
                    },
                    qs: {
                        domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log('Global Resource', JSON.stringify(response));
                    expect(response.status).to.eql(200);
                    expect(response.body.body.data[0].title).to.eql('Global Resources');
                    expect(response.body.body.data[0].label).to.eql('Resource Label');
                    expect(response.body.body.data[0].status).to.eql(2);
                    expect(response.body.body.data[0].pause).to.eql(1);
                    expect(response.body.body.data[0].type).to.eql('resources');
                    expect(response.body.body.data[0].seconds).to.eql(null);
                    expect(response.body.body.data[0].time).to.eql("00:00:32");
                    expect(response.body.body.data[0].order).to.eql(2);
                    expect(response.body.body.data[0].resource_type).to.eql('GlobalDocument');
                    expect(response.body.body.data[0].resource.id).to.eql(resellerDocumentId);
                    expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation Document');
                    expect(response.body.body.data[0].resource.url).to.eql(baseConfig.pdfDocument);
                    expect(response.body.body.data[0].resource.description).to.eql('This is an Description for Documents.');
                    expect(response.body.body.data[0].resource.thumbnail_url).to.eql(baseConfig.pngImage);
                    expect(response.body.body.data[0].resource.status).to.eql(2);

                })
            })
        })
    });
});


