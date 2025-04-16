import { baseConfig } from "../../../../fixtures/baseConfig";
describe('View Usage of Contact with Reseller admin permission', () => {
    let contactId;
    let resellerContactId;
    let resellerSiteContactId;
    let configuredContactId;
    let globalContactId;

    before('Login With Reseller admin permission', () => {
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
        cy.then('Create Global Contact', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/contacts',
                body: {

                    "title": "Cypress Automation Global Contact",
                    "description": "It is a description.",
                    "value": "manis@gmail.com ",
                    "type": 1,
                    "status": 2,
                    "thumbnail_url": null
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Global Contact Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Global Contact')
                const globalContactId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, globalContactId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                globalContactId = data.globalContactId;
            })
        });
        cy.then(() => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: baseConfig.baseUrl + '/contacts',
                body: {

                    "title": "Cypress Automation Global Contact",
                    "description": "It is a description.",
                    "value": "manis@gmail.com ",
                    "type": 1,
                    "status": 2,
                    "thumbnail_url": null
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Global Contact Response', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.title).to.eql('Cypress Automation Global Contact')
                const contactId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, contactId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                contactId = data.contactId;
            })
        });
        cy.then('Configured the Global Contact', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config`,
                body: {
                    "title": "Configured Contact",
                    "description": "This is an Configured contact description.",
                    "thumbnail_url": baseConfig.pngImage,
                    "contact_id": contactId
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for success status');
                expect(response.body.body.title).to.eql('Configured Contact')
                expect(response.body.body.description).to.eql('This is an Configured contact description.');
                expect(response.body.body.thumbnail_url).to.eql(baseConfig.pngImage);
                expect(response.body.body).to.have.property('id');
                configuredContactId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, configuredContactId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });


        cy.then('Create the Site Contact', () => {
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts`,
                body: {

                    "title": "Cypress Automation Site Resources",
                    "description": "It is a description.",
                    "value": "manis@gmail.com ",
                    "type": 1,
                    "status": 2,
                    "thumbnail_url": null
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Contacts');
                expect(response.body.body.title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body).to.have.property('id');
                resellerSiteContactId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, resellerSiteContactId }
                    cy.writeFile('cypress/fixtures/variables.json', updatedData)
                })
            })
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                contactId = data.contactId;
                configuredContactId = data.configuredContactId;
                resellerSiteContactId = data.resellerSiteContactId
            });
        });
    });


    it('View usage for Contacts with Invalid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usageww`,
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

    it('View usage for Contacts with Valid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
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

    it('View usage for Contacts with Invalid Api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usageww`,
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

    it('View usage for Contacts with Valid Api and Valid method', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
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
    it('Attach Global Contact to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": globalContactId,
                "resource_type": "GlobalContact",
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
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            })

        })
    })

    it('Detach Global Contact From Homepage resources and Check for Usage.(Should be Unused)', () => {
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
                "resource_id": globalContactId,
                "resource_type": "GlobalContact",
                "version_id": null
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            })

        })
    })

    it('Attach Global Contact In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/contacts/${globalContactId}`,
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
                url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            })
        })
    })


    it('Detach Global Contact From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/contacts/${globalContactId}`,
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
                url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            })
        })
    })
    it('Attach Global Contact In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/contacts/${globalContactId}`,
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
                url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites[0].id).to.eql(baseConfig.resellerSiteId);
                expect(response.body.body.sites[0].title).to.eql('Ballon');
                expect(response.body.body.sites[0].domain).to.eql('ballon');
            })
        })
    })


    it('Detach Global Contact From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/contacts/${globalContactId}`,
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
                url: `${baseConfig.baseUrl}/contacts/${globalContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.sites).to.be.an('array').that.is.empty;
            });
        });
    });

    it('Attach Site Contact to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: {
                "resource_id": resellerSiteContactId,
                "resource_type": "GlobalContact",
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
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts/${resellerSiteContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources[0].id).to.eql(resellerSiteContactId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Cypress Automation Site Resources');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })

    it('Detach Site Contact From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": resellerSiteContactId,
                "resource_type": "GlobalContact",
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts/${resellerSiteContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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

    it('Attach Site Contact In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/contacts/${resellerSiteContactId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts/${resellerSiteContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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


    it('Detach Site Contact From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/contacts/${resellerSiteContactId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            }, qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts/${resellerSiteContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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
    it('Attach Site Contact In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/contacts/${resellerSiteContactId}`,
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts/${resellerSiteContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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


    it('Detach Site Contact From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/contacts/${resellerSiteContactId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contacts/${resellerSiteContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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
    it('Attach Configured Contact to Homepage resources and Check for Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            body: {
                "resource_id": configuredContactId,
                "resource_type": "GlobalContact",
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
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config/${configuredContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200);
                expect(response.body.body.homepage_resources[0].id).to.eql(configuredContactId);
                expect(response.body.body.homepage_resources[0].title).to.eql('Configured Contact');
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })

        })
    })

    it('Detach Configured Contact From Homepage resources and Check for Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/homepage-resources`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "resource_id": configuredContactId,
                "resource_type": "GlobalContact",
                "version_id": null
            }, qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });

        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config/${configuredContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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

    it('Attach Configured Contact In Site Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/contacts/${configuredContactId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            }, qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config/${configuredContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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


    it('Detach Configured Contact From Site Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/pages/${baseConfig.resellerSitePageId}/contacts/${configuredContactId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            }, qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config/${configuredContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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
    it('Attach Configured Contact In Landing Page and Check For Usage.(Should be Used)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'POST',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/contacts/${configuredContactId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            }, qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config/${configuredContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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


    it('Detach Configured Contact From Landing Page and Check For Usage.(Should be Unused)', () => {
        const accessToken = Cypress.env('accessToken');
        cy.request({
            method: 'DELETE',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/landing-pages/${baseConfig.resellerLandingPageId}/contacts/${configuredContactId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                "order": 1
            }, qs: {
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eql(200, 'Check for Success Status');
        });
        cy.then('Fetch for the Doc Usage.', () => {
            cy.request({
                url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/contact-config/${configuredContactId}/usage`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                qs: {
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                }, failOnStatusCode: false,
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
