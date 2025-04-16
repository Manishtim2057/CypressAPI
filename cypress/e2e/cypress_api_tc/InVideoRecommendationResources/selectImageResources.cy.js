import { baseConfig } from "../../../fixtures/baseConfig";
describe('Select Image resources In-Video Recommendation', () => {
    let imageId;
    let resellerImageId;
    let siteImageId;
    let configuredImageId;

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
                url: `${baseConfig.baseUrl}/images`,
                method: "POST",
                body:{
                    "title": "Cypress Automation Images",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
                    "status": 2,
                    "icon": "far fa-file-images"
               },
               headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Image Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                const imageId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, imageId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                imageId = data.imageId;
            })
        });
        cy.then('Configured the Global Image', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config`,
                body: {
                    "title": "Cypress Configured image",
                    "description": null,
                    "image_id": imageId,
                    "icon": "far fa-file-image"
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
                expect(response.body.body).to.have.property('id');
                configuredImageId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, configuredImageId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });


        cy.then('Create the Site Image', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/images',
                body: {
                    "title": "Cypress Automation",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
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
                expect(response.body.body).to.have.property('id');
                siteImageId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteImageId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData)
                })
            })
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                imageId = data.imageId;
                configuredImageId = data.configuredImageId;
                siteImageId = data.siteImageId
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
                                "resource_id": imageId,
                                "resource_type": "GlobalImage",
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
                                "resource_id": imageId,
                                "resource_type": "GlobalImage",
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
                                "resource_id": imageId,
                                "resource_type": "GlobalImage",
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
                                "resource_id": imageId,
                                "resource_type": "GlobalImage",
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
                                "resource_id": configuredImageId,
                                "resource_type": "GlobalImage",
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
            expect(response.body.body.data[0].resource_type).to.eql('GlobalImage');
            expect(response.body.body.data[0].resource.id).to.eql(configuredImageId);
            expect(response.body.body.data[0].resource.title).to.eql('Cypress Configured image');
            expect(response.body.body.data[0].resource.description).to.eql(null);
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
                                "resource_id": siteImageId,
                                "resource_type": "GlobalImage",
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
            expect(response.body.body.data[0].resource_type).to.eql('GlobalImage');
            expect(response.body.body.data[0].resource.id).to.eql(siteImageId);
            expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation');
            expect(response.body.body.data[0].resource.description).to.eql('This is an Description for images.');
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
                                "resource_id": "1imageId",
                                "resource_type": "GlobalImage",
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
                                "resource_type": "GlobalImage",
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
                                "resource_id": imageId,
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
                                "resource_id": imageId,
                                "resource_type": "GlobalImage",
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
                                    "resource_id": imageId,
                                    "resource_type": "GlobalImage",
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
                                    "resource_id": siteImageId,
                                    "resource_type": "GlobalImage",
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
                expect(response.body.body.data[0].resource_type).to.eql('GlobalImage');
                expect(response.body.body.data[0].resource.id).to.eql(siteImageId);
                expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation');
                expect(response.body.body.data[0].resource.description).to.eql('This is an Description for images.');
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
                                    "resource_id": siteImageId,
                                    "resource_type": "GlobalImage",
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
                expect(response.body.body.data[0].resource_type).to.eql('GlobalImage');
                expect(response.body.body.data[0].resource.id).to.eql(siteImageId);
                expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation');
                expect(response.body.body.data[0].resource.description).to.eql('This is an Description for images.');
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
                                    "resource_id": imageId,
                                    "resource_type": "GlobalImage",
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
        cy.then('Create the Image On reseller', () => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/images`,
                method: "POST",
                body:{
                    "title": "Cypress Automation Image",
                    "url": baseConfig.pngImage,
                    "description": "This is an Description for images.",
                    "status": 2,
                    "icon": "far fa-file-images"
               },
               headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Image Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                resellerImageId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, resellerImageId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    resellerImageId = data.resellerImageId;
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
                                        "resource_id": resellerImageId,
                                        "resource_type": "GlobalImage",
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
                    expect(response.body.body.data[0].resource_type).to.eql('GlobalImage');
                    expect(response.body.body.data[0].resource.id).to.eql(resellerImageId);
                    expect(response.body.body.data[0].resource.title).to.eql('Cypress Automation Image');
                    expect(response.body.body.data[0].resource.description).to.eql('This is an Description for images.');
                    expect(response.body.body.data[0].resource.status).to.eql(2);

                })
            })
        })
    });
});


