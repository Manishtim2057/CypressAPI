import { baseConfig } from "../../../fixtures/baseConfig";
describe('View Usage of Document with Super admin permission', () => {
    let documentId;
    let resellerDocumentId;
    let siteDocumentId;
    let configuredDocumentId;
    let globalDocumentId;

    before('Login With super admin permission', () => {
        cy.request({
            url: baseConfig.authUrl,
            method: "POST",
            body: baseConfig.superadminPermissionBody,
        }).then((response) => {
            cy.log('Login Response', JSON.stringify(response));
            expect(response.status).to.be.eql(200);
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
        });
        cy.then('Login with Master Admin Permission',()=>{
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
        cy.then('Login with Site admin permission',()=>{
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
        cy.then('Login with Reseller Admin Permission',()=>{
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
        cy.then('Login with Site Read Permission',()=>{
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
    });

    it('Create and Attach Documents with Invalid API and Valid Method.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documentss`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${accessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
        });
    });
    
    it('Create and Attach Documents with Valid API and Invalid Method.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "PUT",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${accessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eq(405, 'Check for Invalid method error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');
        });
    });
    
    it('Create and Attach Documents with Invalid API and Invalid Method.',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documentsss`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${accessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');
        });
    });

    it('Create and Attach Contacts And View For the Resources in Usage',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/contacts`,
            method: "POST",
            body: {

                "title": "Cypress Automation",
                "description": "It is a description.",
                "value": "manis@gmail.com",
                "type": 1,
                "status": 1,
                "thumbnail_url": null,
                "attach": {
                  "model": "page",
                  "model_id": baseConfig.sitePageId
                }
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for success status');
            expect(response.body.body.status[0]).to.eql( "The status must be published when attach is present."  )
        });
        });
        
    it('Create and Attach Documents And View For the Resources in Usage',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${accessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${accessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.sitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });

        
    it('Create and Attach Documents And View For the landing pages Resources in Usage',()=>{
        const accessToken = Cypress.env('accessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "landing_page",
                  "model_id": baseConfig.landingPageId
                }
            },
            headers:{
                Authorization:`Bearer ${accessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const accessToken = Cypress.env('accessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${accessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.landingPageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });

    it('Create and Attach Documents And View For the Resources in Usage with master admin permission.',()=>{
        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${masterAdminAccessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${masterAdminAccessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.sitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });

        
    it('Create and Attach Documents And View For the landing pages Resources in Usage with master admin permission.',()=>{
        const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "landing_page",
                  "model_id": baseConfig.landingPageId
                }
            },
            headers:{
                Authorization:`Bearer ${masterAdminAccessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const masterAdminAccessToken = Cypress.env('masterAdminAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${masterAdminAccessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.landingPageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });

    
    it('Create and Attach Documents And View For the Resources in Usage with Site Admin permission',()=>{
        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${siteAdminAccessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${siteAdminAccessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.sitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });

        
    it('Create and Attach Documents And View For the landing pages Resources in Usage with site admin permission',()=>{
        const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "landing_page",
                  "model_id": baseConfig.landingPageId
                }
            },
            headers:{
                Authorization:`Bearer ${siteAdminAccessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const siteAdminAccessToken = Cypress.env('siteAdminAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${siteAdminAccessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.landingPageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });


    it('Create and Attach Documents And View For the Resources in Usage with Site Read permission',()=>{
        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": 3220
                }
            },
            headers:{
                Authorization:`Bearer ${siteReadAccessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(403);
        });
        cy.then('Verify the Document Usage',()=>{
            const siteReadAccessToken = Cypress.env('siteReadAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${siteReadAccessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(403);
            })
        })
    });

        
    it('Create and Attach Documents And View For the landing pages Resources in Usage with site Read permission',()=>{
        const siteReadAccessToken = Cypress.env('siteReadAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "landing_page",
                  "model_id": baseConfig.landingPageId
                }
            },
            headers:{
                Authorization:`Bearer ${siteReadAccessToken}`, 
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(403);
        });
        cy.then('Verify the Document Usage',()=>{
            const siteReadAccessToken = Cypress.env('siteReadAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${siteReadAccessToken}`, 
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(403);
            })
        })
    });

    it('Create and Attach Documents And View For the Resources in Usage with reseller admin permission.',()=>{
        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "page",
                  "model_id": baseConfig.resellerSitePageId
                }
            },
            headers:{
                Authorization:`Bearer ${resellerAdminAccessToken}`, 
            },
            qs:{
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${resellerAdminAccessToken}`, 
                },
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.pages[0].id).to.eql(baseConfig.resellerSitePageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.landing_pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });

        
    it('Create and Attach Documents And View For the landing pages Resources in Usage with reseller admin permission.',()=>{
        const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
        cy.request({
            url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents`,
            method: "POST",
            body:{
                "title": "Cypress Create and Attach Document",
                "url": baseConfig.pdfDocument,
                "description": "This is the description",
                "thumbnail_url": baseConfig.jpgImage,
                "status": 2,
                "icon": "far fa-file-powerpoint",
                "auto_generate_thumbnail": 1,
                "attach": {
                  "model": "landing_page",
                  "model_id": baseConfig.resellerLandingPageId
                }
            },
            headers:{
                Authorization:`Bearer ${resellerAdminAccessToken}`, 
            },
            qs:{
                domain: "b13ee48a8c6048dfa29927c44e9dc19e"
            },
            failOnStatusCode: false,
        }).then((response)=>{
            cy.log('Create and Attach response', JSON.stringify(response));
            expect(response.status).to.eql(200);
            expect(response.body.body.title).to.eql('Cypress Create and Attach Document');
            expect(response.body.body.url).to.eql(baseConfig.pdfDocument);
            expect(response.body.body.description).to.eql('This is the description')
            expect(response.body.body.thumbnail_url).to.eql(baseConfig.jpgImage);
            expect(response.body.body.status).to.eql(2);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
            expect(response.body.body.origin).to.eql(2);
            documentId = response.body.body.id;
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                const updatedData = {... data, documentId};
                cy.writeFile('cypress/fixtures/variables.json', updatedData);
            })
            cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                documentId = data.documentId;
            })
        });
        cy.then('Verify the Document Usage',()=>{
            const resellerAdminAccessToken = Cypress.env('resellerAdminAccessToken');
            cy.request({
                url : `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents/${documentId}/usage`,
                method: "GET",
                headers:{
                    Authorization:`Bearer ${resellerAdminAccessToken}`, 
                },
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                failOnStatusCode:false,
            }).then((response)=>{
                cy.log('Usage Response', JSON.stringify(response))
                expect(response.status).to.eql(200);
                expect(response.body.body.landing_pages[0].id).to.eql(baseConfig.resellerLandingPageId);
                expect(response.body.body.homepage_resources).to.be.an('array').that.is.empty;
                expect(response.body.body.pages).to.be.an('array').that.is.empty;
                expect(response.body.body.video_recommendations).to.be.an('array').that.is.empty;
            })
        })
    });
});
