import { baseConfig } from "../../fixtures/baseConfig";

describe('Campaign Theme Layout list', () => {
    let globalDocumentId;
    let globalContactId;
    let globalImageId;
    let globalLinkId;
    let siteContactId;
    let siteDocumentId;
    let siteImageId;
    let siteLinkId;
    let videoId;
    let siteVideoId;
    let calculatorId;
    let configuredDocumentId;
    let configuredContactId;
    let configuredImageId;
    let configuredLinkId;
    let resellerGlobalDocumentId;
    let dynamicCalculatorId;
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
        cy.then('Login with Master Admin Permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.masterPermissionBody,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('masterAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        })
        cy.then('Login with Site admin permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.SiteAdminPermission358,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('siteAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        });
        cy.then('Login with Reseller Admin Permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.ResellerAdminPermission,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('resellerAdminAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        });
        cy.then('Login with Site Read Permission', () => {
            cy.request({
                url: baseConfig.authUrl,
                method: "POST",
                body: baseConfig.siteReadPermissionBody,
            }).then((response) => {
                cy.log('Login Response', JSON.stringify(response));
                expect(response.status).to.be.eql(200);
                Cypress.env('siteReadAccessToken', response.body.body.access_token); // Store token in Cypress.env
            });
        })
        cy.then('Create the Global Document', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/documents',
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pptxDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.jpgImage,
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
                expect(response.body.body).to.have.property('id');
                const globalDocumentId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalDocumentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.then('Create the Global Document On With Reseller Permission', () => {
            const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/documents',
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pptxDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.jpgImage,
                    "order": 8,
                    "status": 2,
                    "icon": "far fa-file-powerpoint"
                },
                headers: {
                    Authorization: `Bearer ${resellerAdminAccessToken}`,
                },
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Documents');
                expect(response.body.body).to.have.property('id');
                const resellerGlobalDocumentId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, resellerGlobalDocumentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.then('Create The Global Contact Id', () => {
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
                const globalContactId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalContactId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Create Global Images")
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/images',
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
                expect(response.body.body.title).to.eql('Cypress Automation');
                expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
                expect(response.body.body.description).to.eql('This is an Description for images.');
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.icon).to.eql('far fa-file-images');
                expect(response.body.body).to.have.property('id');
                const globalImageId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalImageId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });

        });
        cy.log("Create Global Contact")
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');

            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/links',
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum/",
                    "thumbnail_url": null,
                    "status": 2,
                    "open_in_external": true

                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Global link request is sucessful');
                expect(response.body.body).to.have.property('title');
                expect(response.body.body.title).to.eql('Cypress Automation Link')
                expect(response.body.body.description).to.eql(null)
                expect(response.body.body.thumbnail_url).to.eql(null)
                expect(response.body.body.status).to.eql(2)
                expect(response.body.body.open_in_external).to.eql(true)
                expect(response.body.body).to.have.property('id');
                const globalLinkId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalLinkId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log("Create Site Contact")
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/sites/358/contacts',
                body: {

                    "title": "Cypress Automation",
                    "description": "It is a description.",
                    "value": "manis@gmail.com",
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
                expect(response.body.body.title).to.eql('Cypress Automation');
                expect(response.body.body.description).to.eql('It is a description.');
                expect(response.body.body.value).to.eql('manis@gmail.com');
                expect(response.body.body.type).to.eql(1);
                expect(response.body.body.status).to.eql(2);
                expect(response.body.body.thumbnail_url).to.eql(null);
                const siteContactId = response.body.body.id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteContactId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });

            });
        });
        cy.log('Create site Document')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
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
                expect(response.body.body).to.have.property('id');
                const siteDocumentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteDocumentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                })
            });
        });
        cy.log('Add the Site Image')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images`,
                body: {
                    "title": "Cypress Automation Images",
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
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
                expect(response.body.body).to.have.property('id');
                const siteImageId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteImageId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Add the Site Link')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/links`,
                body: {

                    "title": "Cypress Automation Link",
                    "description": null,
                    "url": "https://www.lipsum/.com",
                    "thumbnail_url": null,
                    "status": 2,
                    "open_in_external": true

                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
                expect(response.body.body).to.have.property('id');
                const linkId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Add the Video')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'GET',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/categories/${baseConfig.sitePageId}/videos`,
                // body: {
                //     "title": "Reseller Cyp Video",
                //     "description": "string",
                //     "author": "string",
                //     "duration": 220,
                //     "size": null,
                //     "video_url": "https://player.vimeo.com/video/277535214",
                //     "video_thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/images/6Z4xU38L1gkY56t5mT2hIK4brjTWIO4wUmU6cuVR.png",
                //     "status": 2,
                //     "is_global": true
                //   },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
                expect(response.body.body.data[0]).to.have.property('id');
                const videoId = response.body.body.data[0].id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, videoId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Add the Site Video')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/site-videos`,
                body: {
                    "title": "Site Cyp Videos",
                    "description": "string",
                    "author": "string",
                    "duration": 220,
                    "size": null,
                    "video_url": "https://player.vimeo.com/video/277535214",
                    "video_thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/images/6Z4xU38L1gkY56t5mT2hIK4brjTWIO4wUmU6cuVR.png",
                    "status": 2,
                    "is_global": true
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
                expect(response.body.body).to.have.property('id');
                const siteVideoId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteVideoId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log('Add Calculator')
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/calculators`,
                body: {
                    "title": "Cyp Calculator",
                    "description": "Sample description",
                    "url": "https://www.lipsum.com/",
                    "status": 2,
                    "is_global": true,
                    "order": 2,
                    "created_at": "string",
                    "updated_at": "string"
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check Site Link request is sucessful');
                expect(response.body.body).to.have.property('id');
                const calculatorId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, calculatorId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            globalDocumentId = data.globalDocumentId
            globalContactId = data.globalContactId
            globalImageId = data.globalImageId
            globalLinkId = data.globalLinkId
            siteContactId = data.siteContactId
            siteDocumentId = data.siteDocumentId
            siteLinkId = data.siteLinkId
            siteImageId = data.siteImageId
            videoId = data.videoId
            siteVideoId = data.siteVideoId
            calculatorId = data.calculatorId
            dynamicCalculatorId = data.dynamicCalculatorId

        });
    });

    it('Create the Campaign layout with invalid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'GET',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layoutss`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        })
    });

    it('Create the Campaign layoutwith valid api and invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Invalid method error');

        })
    });
    it('Create the Campaign layoutwith Invalid api and invalid method', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'DELETE',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layoutss`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        })
    });
    it('Create the Campaign layoutwith valid api and valid method', () => {

        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');


        })
    });
    it('Create the Campaign layout with Side Admin Permission', () => {

        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${siteAdminAccessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');


        })
    });
    it('Create the Campaign layout with Master Admin Permission', () => {

        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${masterAdminAccessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');
        })
    });
    it('Create the Campaign layout with Site Read Permission', () => {

        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${siteReadAccessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(403, 'Check for Not found error');
        })
    });
    it('Create the Campaign layout with Reseller Admin Permission', () => {

        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.resellerSiteId}/campaigns/${baseConfig.resellerLandingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${resellerAdminAccessToken}`,
            },
            qs:{
                domain:  "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": resellerGlobalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": resellerGlobalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Not found error');
        })
    });
    it('Create the Campaign layoutwith Title as empty.', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Pop-up",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.title).to.eql([
                "The title field is required."
            ])


        })
    });
    it('Create the Campaign layoutwith Children title as empty.', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body["children.0.title"]).to.eql([
                "The children.0.title field is required."
            ])
        })
    });
    it('Create Campaign theme layout with Order and children Order as 0.', () => {

        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 0,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 0
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.order).to.eql([
                "The order must be at least 1."
            ])
            expect(response.body.body["children.0.order"]).to.eql([
                "The children.0.order must be at least 1."
            ])
        })
    });
    it('Create Campaign theme layout with resourceId as invalid.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": "asd",
                        "resource_type": "GlobalDocument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": "asdasd",
                                "resource_type": "GlobalDocument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.content).to.eql([
                "The content resource id must be an integer.",
                "The content resources is invalid."
            ])
            expect(response.body.body["children.0.content"]).to.eql([
                "The content resource id must be an integer.",
                "The children.0.content resources is invalid."
            ])
        })
    });
    it('Create Campaign theme layout with resource_type as invalid.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDasddascument",
                        "resources": {

                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDoasdasdcument",
                                "resources": {

                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.content).to.eql([
                "The content resource type must be a valid string.",
                "The content resources is invalid."
            ])
            expect(response.body.body["children.0.content"]).to.eql([
                "The content resource type must be a valid string.",
                "The children.0.content resources is invalid."
            ])
        })
    });
    it('Create Campaign theme layout with resource id as invalid for resource object.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {
                            "resource_id": 999999999,
                            "resource_type": "GlobalDocument"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {
                                    "resource_id": 9999999999,
                                    "resource_type": "GlobalDocument"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.content).to.eql([
                "The content resources is invalid."
            ])
            expect(response.body.body["children.0.content"]).to.eql([
                "The children.0.content resources is invalid."
            ])
        })
    });
    it('Create Campaign theme layout with resource type as invalid for resource object.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {
                            "resource_id": globalDocumentId,
                            "resource_type": "GlobalDssocument"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {
                                    "resource_id": globalDocumentId,
                                    "resource_type": "GlobalDosscument"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.content).to.eql([
                "The content resources is invalid."
            ])
            expect(response.body.body["children.0.content"]).to.eql([
                "The children.0.content resources is invalid."
            ])
        })
    });
    it('Create Campaign theme layout with resource type and resource id as invalid for resource object.', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {
                            "resource_id": 9999999999,
                            "resource_type": "GlobalDssocument"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {
                                    "resource_id": 999999999999,
                                    "resource_type": "GlobalDosscument"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for Not found error');
            expect(response.body.body.content).to.eql([
                "The content resources is invalid."
            ])
            expect(response.body.body["children.0.content"]).to.eql([
                "The children.0.content resources is invalid."
            ])
        })
    });
    it('Create Campaign theme layout with resource type as global Contact', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalContactId,
                        "resource_type": "GlobalContact",
                        "resources": {
                            "resource_id": globalContactId,
                            "resource_type": "GlobalContact"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalContactId,
                                "resource_type": "GlobalContact",
                                "resources": {
                                    "resource_id": globalContactId,
                                    "resource_type": "GlobalContact"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as global Link', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalLinkId,
                        "resource_type": "GlobalLink",
                        "resources": {
                            "resource_id": globalLinkId,
                            "resource_type": "GlobalLink"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalLinkId,
                                "resource_type": "GlobalLink",
                                "resources": {
                                    "resource_id": globalLinkId,
                                    "resource_type": "GlobalLink"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as global image', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": globalImageId,
                        "resource_type": "GlobalImage",
                        "resources": {
                            "resource_id": globalImageId,
                            "resource_type": "GlobalImage"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": globalImageId,
                                "resource_type": "GlobalImage",
                                "resources": {
                                    "resource_id": globalImageId,
                                    "resource_type": "GlobalImage"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as site Document', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": siteDocumentId,
                        "resource_type": "GlobalDocument",
                        "resources": {
                            "resource_id": siteDocumentId,
                            "resource_type": "GlobalDocument"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": siteDocumentId,
                                "resource_type": "GlobalDocument",
                                "resources": {
                                    "resource_id": siteDocumentId,
                                    "resource_type": "GlobalDocument"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as site Contact', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": siteContactId,
                        "resource_type": "GlobalContact",
                        "resources": {
                            "resource_id": siteContactId,
                            "resource_type": "GlobalContact"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": siteContactId,
                                "resource_type": "GlobalContact",
                                "resources": {
                                    "resource_id": siteContactId,
                                    "resource_type": "GlobalContact"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as site Link', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": siteLinkId,
                        "resource_type": "GlobalLink",
                        "resources": {
                            "resource_id": siteLinkId,
                            "resource_type": "GlobalLink"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": siteLinkId,
                                "resource_type": "GlobalLink",
                                "resources": {
                                    "resource_id": siteLinkId,
                                    "resource_type": "GlobalLink"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as site Image', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": siteImageId,
                        "resource_type": "GlobalImage",
                        "resources": {
                            "resource_id": siteImageId,
                            "resource_type": "GlobalImage"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": siteImageId,
                                "resource_type": "GlobalImage",
                                "resources": {
                                    "resource_id": siteImageId,
                                    "resource_type": "GlobalImage"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            }
            ,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as Video', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": videoId,
                        "version_id": null,
                        "resource_type": "Video",
                        "resources": {
                            "resource_id": videoId,
                            "version_id": null,
                            "resource_type": "Video"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": videoId,
                                "version_id": null,
                                "resource_type": "Video",
                                "resources": {
                                    "resource_id": videoId,
                                    "version_id": null,
                                    "resource_type": "Video"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as Site Video', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": siteVideoId,
                        "resource_type": "SiteVideo",
                        "resources": {
                            "resource_id": siteVideoId,
                            "resource_type": "SiteVideo"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": siteVideoId,
                                "resource_type": "SiteVideo",
                                "resources": {
                                    "resource_id": siteVideoId,
                                    "resource_type": "SiteVideo"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as Calculator', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": calculatorId,
                        "resource_type": "Calculator",
                        "resources": {
                            "resource_id": calculatorId,
                            "resource_type": "Calculator"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": calculatorId,
                                "resource_type": "Calculator",
                                "resources": {
                                    "resource_id": calculatorId,
                                    "resource_type": "Calculator"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as Dynamic Calculator', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "title": "Header",
                "content": [{
                    "This is the Header of the Journey": {
                        "resource_id": 1,
                        "resource_type": "SiteDynamicCalculator",
                        "resources": {
                            "resource_id": 1,
                            "resource_type": "SiteDynamicCalculator"
                        }
                    }
                }],
                "order": 1,
                "children": [{
                    "title": "Banner",
                    "content":
                        [{
                            "This is Pop-up Content": {
                                "resource_id": 1,
                                "resource_type": "SiteDynamicCalculator",
                                "resources": {
                                    "resource_id": 1,
                                    "resource_type": "SiteDynamicCalculator"
                                }
                            }
                        }],
                    "order": 1
                }
                ]
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for Success Status');
        })
    });
    it('Create Campaign theme layout with resource type as configed Documents', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/document-config',
            body: {
                "title": "configured Document",
                "description": null,
                "thumbnail_url": null,
                "document_id": globalDocumentId,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body).to.have.property('id');
            configuredDocumentId = response.body.body.id;

            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredDocumentId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredDocumentId = data.configuredDocumentId
        });
        cy.then('Create theme layout with Configed layouts', () => {
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "title": "Header",
                    "content": [{
                        "This is the Header of the Journey": {
                            "resource_id": configuredDocumentId,
                            "resource_type": "GlobalDocument",
                            "resources": {
                                "resource_id": configuredDocumentId,
                                "resource_type": "GlobalDocument"
                            }
                        }
                    }],
                    "order": 1,
                    "children": [{
                        "title": "Banner",
                        "content":
                            [{
                                "This is Pop-up Content": {
                                    "resource_id": configuredDocumentId,
                                    "resource_type": "GlobalDocument",
                                    "resources": {
                                        "resource_id": configuredDocumentId,
                                        "resource_type": "GlobalDocument"
                                    }
                                }
                            }],
                        "order": 1
                    }
                    ]
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Status');
            })
        });
    });
    it('Create Campaign theme layout with resource type as configed Contacts', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/contact-config',
            body: {
                "title": "Cypress configured image",
                "description": null,
                "thumbnail_url": "",
                "contact_id": globalContactId
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body).to.have.property('id');
            configuredContactId = response.body.body.id;

            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredContactId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredContactId = data.configuredContactId
        });
        cy.then('Create theme layout with Configed layouts', () => {
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "title": "Header",
                    "content": [{
                        "This is the Header of the Journey": {
                            "resource_id": configuredContactId,
                            "resource_type": "GlobalContact",
                            "resources": {
                                "resource_id": configuredContactId,
                                "resource_type": "GlobalContact"
                            }
                        }
                    }],
                    "order": 1,
                    "children": [{
                        "title": "Banner",
                        "content":
                            [{
                                "This is Pop-up Content": {
                                    "resource_id": configuredContactId,
                                    "resource_type": "GlobalContact",
                                    "resources": {
                                        "resource_id": configuredContactId,
                                        "resource_type": "GlobalContact"
                                    }
                                }
                            }],
                        "order": 1
                    }
                    ]
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Status');
            })
        });
    });
    it('Create Campaign theme layout with resource type as configed Links', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/link-config/',
           body:{
                "title": "configured link",
                "description": null,
                "thumbnail_url": null,
                "link_id": globalLinkId
              },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for validation error');
            configuredLinkId = response.body.body.id;

            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredLinkId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredLinkId = data.configuredLinkId
        });
        cy.then('Create theme layout with Configed layouts', () => {
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "title": "Header",
                    "content": [{
                        "This is the Header of the Journey": {
                            "resource_id": configuredLinkId,
                            "resource_type": "GlobalLink",
                            "resources": {
                                "resource_id": configuredLinkId,
                                "resource_type": "GlobalLink"
                            }
                        }
                    }],
                    "order": 1,
                    "children": [{
                        "title": "Banner",
                        "content":
                            [{
                                "This is Pop-up Content": {
                                    "resource_id": configuredLinkId,
                                    "resource_type": "GlobalLink",
                                    "resources": {
                                        "resource_id": configuredLinkId,
                                        "resource_type": "GlobalLink"
                                    }
                                }
                            }],
                        "order": 1
                    }
                    ]
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Status');
            })
        });
    });
    it('Create Campaign theme layout with resource type as configed Images', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/' + baseConfig.siteId + '/image-config',
            body: {
                "title": "Cypress configured image",
                "description": null,
                "image_id": globalImageId,
                "icon": "far fa-file-image"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for success status');
            expect(response.body.body).to.have.property('id');
            configuredImageId = response.body.body.id;

            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                const updatedData = { ...data, configuredImageId };
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            });
        });
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            configuredImageId = data.configuredImageId
        });
        cy.then('Create theme layout with Configed layouts', () => {
            cy.request({
                method: 'POST',
                url: `${baseConfig.url}/sites/${baseConfig.siteId}/campaigns/${baseConfig.landingPageId}/layouts`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "title": "Header",
                    "content": [{
                        "This is the Header of the Journey": {
                            "resource_id": configuredImageId,
                            "resource_type": "GlobalImage",
                            "resources": {
                                "resource_id": configuredImageId,
                                "resource_type": "GlobalImage"
                            }
                        }
                    }],
                    "order": 1,
                    "children": [{
                        "title": "Banner",
                        "content":
                            [{
                                "This is Pop-up Content": {
                                    "resource_id": configuredImageId,
                                    "resource_type": "GlobalImage",
                                    "resources": {
                                        "resource_id": configuredImageId,
                                        "resource_type": "GlobalImage"
                                    }
                                }
                            }],
                        "order": 1
                    }
                    ]
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for Success Status');
            })
        });
    });
});