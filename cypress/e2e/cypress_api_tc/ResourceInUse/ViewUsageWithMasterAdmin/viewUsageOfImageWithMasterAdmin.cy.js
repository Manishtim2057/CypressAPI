import { baseConfig } from "../../../../fixtures/baseConfig";
describe('View Usage of Image in Site', () => {
    let imageId;
    let resellerImageId;
    let siteImageId;
    let configuredImageId;
    let globalImageId;

    before('Login With MasterAdmin permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.masterPermissionBody,
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
                    "title": "Cypress Automation Global Image",
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
                cy.log('Global Image Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Global Image')
                const globalImageId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalImageId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                globalImageId = data.globalImageId;
            })
        });
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url: `${baseConfig.baseUrl}/images`,
                method: "POST",
                body:{
                    "title": "Cypress Automation Global Image",
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
                cy.log('Global Image Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Global Image')
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
                    "title": "Configured Image",
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
                expect(response.body.body.title).to.eql('Configured Image')
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
                    "title": "Cypress Automation Site Resources",
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
                expect(response.body.body.title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.url).to.eql(baseConfig.pngImage);
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
            });
        });
    });


    it('View usage for Images with Invalid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/images/${globalImageId}/usageww`,
            method: "GET", headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        })
    })

    it('View usage for Images with Valid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
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

    it('View usage for Images with Invalid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/images/${globalImageId}/usageww`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404);
            expect(response.body.status.message).to.eql('The item/page you were looking for cannot be found.')
        })

    })

    it('View usage for Images with Valid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200);
        })

    })
    it('Attach Global Image to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": globalImageId,
                "resource_type": "GlobalImage",
                "version_id": null,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.',()=>{
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(358);
                expect(response.body.body.sites[0].title).to.eql('Sena');
                expect(response.body.body.sites[0].domain).to.eql('qa');
            })

        })
    })
    
    it('Detach Global Image From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": globalImageId,
                "resource_type": "GlobalImage",
                "version_id": null
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            })

        })
    })

    it('Attach Global Image In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${globalImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(358);
                expect(response.body.body.sites[0].title).to.eql('Sena');
                expect(response.body.body.sites[0].domain).to.eql('qa');
            })
        })
    })

    
    it('Detach Global Image From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${globalImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            })
        })
    })
    it('Attach Global Image In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/${globalImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(358);
                expect(response.body.body.sites[0].title).to.eql('Sena');
                expect(response.body.body.sites[0].domain).to.eql('qa');
            })
        })
    })

    
    it('Detach Global Image From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/${globalImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            });
        });
    });
    it('Attach Global Image In In-video Recommendation and Check For Usage.(Should be Used)', () => {
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
                                "resource_id": globalImageId,
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
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/images/${globalImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(358);
                expect(response.body.body.sites[0].title).to.eql('Sena');
                expect(response.body.body.sites[0].domain).to.eql('qa');
            });
        });
    });

    
    it('Detach Global Image From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": []
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites || []).to.be.an('array').that.is.empty;
            });
        });
    });
    
    it('Attach Site Image to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": siteImageId,
                "resource_type": "GlobalImage",
                "version_id": null,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.',()=>{
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources[0].id).to.eql(siteImageId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })
    
    it('Detach Site Image From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": siteImageId,
                "resource_type": "GlobalImage",
                "version_id": null
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })

        })
    })

    it('Attach Site Image In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${siteImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.sitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Site Image From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${siteImageId}`,
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Site Image In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/${siteImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.landingPageId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Site Image From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/${siteImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Site Image In In-video Recommendation and Check For Usage.(Should be Used)', () => {
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
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.video_recommendations[0].id).to.eql(baseConfig.videoId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Site Image From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": []
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/images/${siteImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
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
    it('Attach Configured Image to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": configuredImageId,
                "resource_type": "GlobalImage",
                "version_id": null,
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.',()=>{
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources[0].id).to.eql(configuredImageId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Configured Image');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })
    
    it('Detach Configured Image From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": configuredImageId,
                "resource_type": "GlobalImage",
                "version_id": null
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })

        })
    })

    it('Attach Configured Image In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${configuredImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.sitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Configured Image From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/pages/${baseConfig.sitePageId}/images/${configuredImageId}`,
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Configured Image In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/${configuredImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.landingPageId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Configured Image From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/landing-pages/${baseConfig.landingPageId}/images/${configuredImageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;            })
        })
    })
    it('Attach Configured Image In In-video Recommendation and Check For Usage.(Should be Used)', () => {
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
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.video_recommendations[0].id).to.eql(baseConfig.videoId);
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
            })
        })
    })

    
    it('Detach Configured Image From In-video Recommendation and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/videos/${baseConfig.videoId}/recommendations/multiple`,
            method: "PUT",
            body: {
                "suggestions": []
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/image-config/${configuredImageId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                failOnStatusCode: false,
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
