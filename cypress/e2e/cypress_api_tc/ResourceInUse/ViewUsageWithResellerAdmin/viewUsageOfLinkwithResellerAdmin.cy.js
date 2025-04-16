import { baseConfig } from "../../../../fixtures/baseConfig";describe('View Usage of Link in Site', () => {
    let linkId;
    let resellerLinkId;
    let siteLinkId;
    let configuredLinkId;
    let globalLinkId;

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
                url: `${baseConfig.baseUrl}/links`,
                method: "POST",
                body: {
                    "title": "Cypress Automation Global Link",
                  "description": null,
                "url": "https://www.lipsum/",
                "thumbnail_url": null,
                "status": 2,
                "open_in_external": true

            },
            qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, 
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
                cy.log('Global Link Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Global Link')
                const globalLinkId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalLinkId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                globalLinkId = data.globalLinkId;
            })
        });
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url: `${baseConfig.baseUrl}/links`,
                method: "POST",
                body: {
                    "title": "Cypress Automation Site Link",
                    "description": null,
                "url": "https://www.lipsum/",
                "thumbnail_url": null,
                "status": 2,
                "open_in_external": true

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs:{
             domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
            failOnStatusCode: false,
        }).then((response) => {
                cy.log('Global Link Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Site Link')
                const linkId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, linkId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                linkId = data.linkId;
            })
        });
        cy.then('Configured the Global Link', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config`,
                body: {
                    "title": "Configured link",
                    "description": "This is an Configured link description.",
                    "thumbnail_url": baseConfig.jpgImage,
                    "link_id": linkId
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
                expect(response.body.body.title).to.eql('Configured link')
                expect(response.body.body.description).to.eql('This is an Configured link description.');
                expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
                expect(response.body.body).to.have.property('id');
                configuredLinkId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, configuredLinkId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });


        cy.then('Create the Site Link', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links`,
                body: {
                    "title": "Cypress Automation Site Resources",
                    "description": null,
                    "url": "https://www.lipsum.com/",
                    "thumbnail_url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/z6OYIjXxyH036sxDup3PIYVjfCxvG8jPpMNbBRrF_thumb.png",
                    "status": 2,
                    "open_in_external": true
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
 qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },               failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Links');
                expect(response.body.body.title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body).to.have.property('id');
                siteLinkId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, siteLinkId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData)
                })
            })
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                linkId = data.linkId;
                configuredLinkId = data.configuredLinkId;
                siteLinkId = data.siteLinkId
            });
        });
    });


    it('View usage for Links with Invalid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/links/${globalLinkId}/usageww`,
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

    it('View usage for Links with Valid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
               domain: "b13ee48a8c6048dfa29927c44e9dc19e"
           },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405);
            expect(response.body.status.message).to.eql('Invalid method call.')
        })
    })

    it('View usage for Links with Invalid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/links/${globalLinkId}/usageww`,
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

    it('View usage for Links with Valid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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
    it('Attach Global Link to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": globalLinkId,
                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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
    
    it('Detach Global Link From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": globalLinkId,
                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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

    it('Attach Global Link In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/links/${globalLinkId}`,
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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

    
    it('Detach Global Link From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/links/${globalLinkId}`,
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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
    it('Attach Global Link In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links/${globalLinkId}`,
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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

    
    it('Detach Global Link From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links/${globalLinkId}`,
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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
            });
        });
    });
    it('Attach Global Link In In-video Recommendation and Check For Usage.(Should be Used)', () => {
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
                                "resource_id": globalLinkId,
                                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/links/${globalLinkId}/usage`,
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
            });
        });
    });

    
    it('Detach Global Link From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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
                expect(response.body.body.sites || []).to.be.an('array').that.is.empty;
            });
        });
    });
    
    it('Attach Site Link to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": siteLinkId,
                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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
                expect(response.body.body.homepage_resources[0].id).to.eql(siteLinkId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })
    
    it('Detach Site Link From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": siteLinkId,
                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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

    it('Attach Site Link In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/links/${siteLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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

    
    it('Detach Site Link From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/links/${siteLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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
    it('Attach Site Link In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links/${siteLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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

    
    it('Detach Site Link From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links/${siteLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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
    it('Attach Site Link In In-video Recommendation and Check For Usage.(Should be Used)', () => {
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
                                "resource_id": siteLinkId,
                                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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

    
    it('Detach Site Link From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/links/${siteLinkId}/usage`,
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
    it('Attach Configured Link to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": configuredLinkId,
                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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
                expect(response.body.body.homepage_resources[0].id).to.eql(configuredLinkId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Configured link');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })
    
    it('Detach Configured Link From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": configuredLinkId,
                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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

    it('Attach Configured Link In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/links/${configuredLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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

    
    it('Detach Configured Link From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/links/${configuredLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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
    it('Attach Configured Link In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links/${configuredLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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

    
    it('Detach Configured Link From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/links/${configuredLinkId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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
    it('Attach Configured Link In In-video Recommendation and Check For Usage.(Should be Used)', () => {
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
                                "resource_id": configuredLinkId,
                                "resource_type": "GlobalLink",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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

    
    it('Detach Configured Link From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/link-config/${configuredLinkId}/usage`,
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
