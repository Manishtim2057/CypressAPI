import { baseConfig } from "../../../../fixtures/baseConfig";describe('View Usage of Document in Site', () => {
    let documentId;
    let resellerDocumentId;
    let siteDocumentId;
    let configuredDocumentId;
    let globalDocumentId;

    before('Login With Reseller Admin permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.ResellerAdminPermission,
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
                    "title": "Cypress Automation Global Document",
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
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Document Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Global Document')
                const globalDocumentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalDocumentId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                globalDocumentId = data.globalDocumentId;
            })
        });
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url: `${baseConfig.baseUrl}/documents`,
                method: "POST",
                body: {
                    "title": "Cypress Automation Site Document",
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
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false
            }).then((response) => {
                cy.log('Global Document Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Site Document')
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config`,
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
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents`,
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
                 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
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
            });
        });
    });


    it('View usage for Documents with Invalid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usageww`,
            method: "GET", headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        })
    })

    it('View usage for Documents with Valid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405);
            expect(response.body.status.message).to.eql('Invalid method call.')
        })
    })

    it('View usage for Documents with Invalid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usageww`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        })

    })

    it('View usage for Documents with Valid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        })

    })
    it('Attach Global Document to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": globalDocumentId,
                "resource_type": "GlobalDocument",
                "version_id": null,
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.',()=>{
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },              failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            })

        })
    })
    
    it('Detach Global Document From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": globalDocumentId,
                "resource_type": "GlobalDocument",
                "version_id": null
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            })

        })
    })

    it('Attach Global Document In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/documents/${globalDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            })
        })
    })

    
    it('Detach Global Document From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/documents/${globalDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            })
        })
    })
    it('Attach Global Document In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/documents/${globalDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            })
        })
    })

    
    it('Detach Global Document From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/documents/${globalDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },              failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            });
        });
    });
    it('Attach Global Document In In-video Recommendation and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
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
                                "resource_id": globalDocumentId,
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
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/documents/${globalDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },            failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            });
        });
    });

    
    it('Detach Global Document From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": []
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },              failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites || []).to.be.an('array').that.is.empty;
            });
        });
    });
    
    it('Attach Site Document to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": siteDocumentId,
                "resource_type": "GlobalDocument",
                "version_id": null,
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.',()=>{
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               },            failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources[0].id).to.eql(siteDocumentId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })
    
    it('Detach Site Document From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            body: {
                "resource_id": siteDocumentId,
                "resource_type": "GlobalDocument",
                "version_id": null
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })

        })
    })

    it('Attach Site Document In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/documents/${siteDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.resellerSitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Site Document From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/documents/${siteDocumentId}`,
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Site Document In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/documents/${siteDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.resellerLandingPageId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Site Document From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/documents/${siteDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Site Document In In-video Recommendation and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
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
                                "resource_id": siteDocumentId,
                                "resource_type": "GlobalDocument",
                                "order": 2
                            }
                        ]
                    }
                ]
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.video_recommendations[0].id).to.eql(baseConfig.resellerVideoId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Site Document From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": []
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${siteDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;           
            })
        })
    })

    /////////////////////////////////
    it('Attach Configured Document to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": configuredDocumentId,
                "resource_type": "GlobalDocument",
                "version_id": null,
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.',()=>{
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources[0].id).to.eql(configuredDocumentId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Configured Document');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })
    
    it('Detach Configured Document From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": configuredDocumentId,
                "resource_type": "GlobalDocument",
                "version_id": null
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })

        })
    })

    it('Attach Configured Document In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/documents/${configuredDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                   domain: "b13ee48a8c6048dfa29927c44e9dc19e"
               }, 
                 failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.resellerSitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Configured Document From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/documents/${configuredDocumentId}`,
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Configured Document In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/documents/${configuredDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.resellerLandingPageId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Configured Document From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/documents/${configuredDocumentId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Configured Document In In-video Recommendation and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
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
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.video_recommendations[0].id).to.eql(baseConfig.resellerVideoId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Configured Document From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/videos/${baseConfig.resellerVideoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": []
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           }, 
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/document-config/${configuredDocumentId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;           
            })
        })
    })
    
})
