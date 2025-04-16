import { baseConfig } from "../../../../../fixtures/baseConfig";
let documentId1;
let documentId2;


describe('Edit operations of the Document', () => {

    before(() => {
        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: {
                "username": "superuser@learnyourbenefits.com",
                "password": "lyb@20!9"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.log('Get ids of Document');
        cy.then(()=>{
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method : 'GET',
                url: baseConfig.baseUrl + '/documents',
               headers:{
                Authorization : `Bearer ${accessToken}`,
               },
               failOnStatusCode: false,
            }).then((response)=>{
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const documentId1 = response.body.body.data[0].id;
                const documentId2 = response.body.body.data[1].id;

                cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                    const updatedData = { ...data, documentId1, documentId2};
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
        cy.log("Read The variables")
        cy.readFile('cypress/fixtures/variables.json').then((data) => {
            documentId1 = data.documentId1
            documentId2 = data.documentId2
        });
    });

    it('Edit bulk global document with doc 1 with Invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/imagess',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('Edit bulk global document with doc 1 with Invalid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/imagess',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(404, 'Check for Not found error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('The item/page you were looking for cannot be found.');

        });
    });

    it('Edit bulk global document with doc 1 with valid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PATCH',
            url: baseConfig.baseUrl + '/documents/multiple',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        });
    });

    it('Edit bulk global document with doc 1 with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {   
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
         }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 title as Upperlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 title as lowerlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "O",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 title as Upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Lorem ipsum dolasddddddddddddor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Documents');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title may not be greater than 255 characters.']);

        });
    });
    it('Edit bulk global document with doc 1 title as empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Documents');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
        });
    });

    it('Edit bulk global document with doc 1 title as String.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
         }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 title as Integer.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 Description as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": null,
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation of Documents');
            expect(response.body.body['data.0.description']).to.eql(['The data.0.description field is required.']);
        });
    });


    it('Edit bulk global document with doc 1 type as PDF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
         }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 type as DOCX.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.docxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
          }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 type as DOC.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.docDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 type as xlsx.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.xlsxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 type as xls.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.xlsDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 type as PPT.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });
    it('Edit bulk global document with doc 1 type as PPTX.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 type as Invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Documents');
            expect(response.body.body['data.0.url']).to.eql(['The data.0.url must end with one of the following: .pdf, .docx, .doc, .xlsx, .xls, .ppt, .pptx.']);

        });
    });
    it('Edit bulk global document with doc 1 Thumbnail as type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "vitaephare",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf",
                        "description": "String",
                        "thumbnail_url": baseConfig.gifImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Documents');
            expect(response.body.body["data.0.thumbnail_url"]).to.eql(['The data.0.thumbnail_url must end with one of the following: .jpg, .png, .jpeg.']);

        });
    });

    it('Edit bulk global document with doc 1 with Thumbnail type as JPG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpgImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 Thumbnail type as PNG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 Thumbnail type as JPEG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpegImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 with icon as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpegImage,
                        "order": 8,
                        "status": 2,
                        "icon": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.icon"]).to.eql(['The data.0.icon field is required.']);
        });
    });
    
    ///////////////////////////////////

    


    it('Edit bulk global document with doc 1 and 2 title as Upperlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        
                        "id":documentId1,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },{
                        "id":documentId2,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 and 2 title as lowerlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "O",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                       "title": "O",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 and 2 title as Upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                       "id":documentId1,
                         "title": "Lorem ipsum dolasddddddddddddor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                         "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "title": "Lorem ipsum dolasddddddddddddor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Documents');
            expect(response.body.body).to.have.property('data.0.title');

            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title may not be greater than 255 characters.']);
            expect(response.body.body["data.1.title"]).to.eql(['The data.1.title may not be greater than 255 characters.']);

        });
    });
    it('Edit bulk global document with doc 1 and doc 2 title as empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "title": "",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Documents');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
            expect(response.body.body["data.1.title"]).to.eql(['The data.1.title field is required.']);
       });
    });

    it('Edit bulk global document with doc 1 and doc 2 title as String.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and doc 2 title as Integer.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and doc 2 Description as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": null,
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": null,
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation of Documents');
            expect(response.body.body['data.0.description']).to.eql(['The data.0.description field is required.']);
            expect(response.body.body['data.1.description']).to.eql(['The data.1.description field is required.']);

        });
    });



    it('Edit bulk global document with doc 1 and doc 2 type as PDF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                         "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pdfDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 and Doc 2 type as DOCX.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.docxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                         "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.docxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 and doc 2type as DOC.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.docDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.docDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 and Doc 2 type as xlsx.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.xlsxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.xlsxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and doc 2type as xls.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.xlsDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.xlsDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and Doc 2 type as PPT.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and 2 type as PPTX.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
       }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and 2 type as Invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Documents');
            expect(response.body.body['data.0.url']).to.eql(['The data.0.url must end with one of the following: .pdf, .docx, .doc, .xlsx, .xls, .ppt, .pptx.']);
            expect(response.body.body['data.1.url']).to.eql(['The data.1.url must end with one of the following: .pdf, .docx, .doc, .xlsx, .xls, .ppt, .pptx.']);
        });
    });
    it('Edit bulk global document with doc 1 and 2 Thumbnail as type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "vitaephare",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf",
                        "description": "String",
                        "thumbnail_url": baseConfig.gifImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "vitaephare",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf",
                        "description": "String",
                        "thumbnail_url": baseConfig.gifImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Documents');
            expect(response.body.body["data.0.thumbnail_url"]).to.eql(['The data.0.thumbnail_url must end with one of the following: .jpg, .png, .jpeg.']);
            expect(response.body.body["data.1.thumbnail_url"]).to.eql(['The data.1.thumbnail_url must end with one of the following: .jpg, .png, .jpeg.']);
        });
    });

    it('Edit bulk global document with doc 1 and 2 with Thumbnail type as JPG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpgImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpgImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and 2 Thumbnail type as PNG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                       "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.pngImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });

    it('Edit bulk global document with doc 1 and 2 Thumbnail type as JPEG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpegImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpegImage,
                        "order": 8,
                        "status": 2,
                        "icon": "far fa-file-powerpoint"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.status.message).to.eql('Okay');
        });
    });


    it('Edit bulk global document with doc 1 and 2 with icon as null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documents/multiple',
            body: {
                "data": [
                    {
                        "id":documentId1,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpegImage,
                        "order": 8,
                        "status": 2,
                        "icon": null
                    },
                    {
                        "id":documentId2,
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.jpegImage,
                        "order": 8,
                        "status": 2,
                        "icon": null
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for validation error');
            expect(response.body.body["data.0.icon"]).to.eql(['The data.0.icon field is required.']);
            expect(response.body.body["data.1.icon"]).to.eql(['The data.1.icon field is required.']);
        });
    });

    it('Edit  Image with image with All read Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: {
                "username": "samundra@mail.com",
                "password": "1!passworD"
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenReadPermission', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenReadPermission = Cypress.env('accessTokenReadPermission');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/documents/multiple',
                body: {
                    "data": [
                        {
                            "id":documentId1,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        },
                        {
                            "id":documentId2,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status of Images');
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");
            });
        });
    });


    it('Edit  Image with image with MasterAdmin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.masterPermissionBody,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenMasterAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenMasterAdmin = Cypress.env('accessTokenMasterAdmin');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/documents/multiple',
                body: {
                    "data": [
                        {
                            "id":documentId1,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        },
                        {
                            "id":documentId2,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenMasterAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');
            });
        });
    });

    it('Edit  Image with image with Site Admin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.SiteAdminPermission358,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenSiteAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenSiteAdmin = Cypress.env('accessTokenSiteAdmin');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/documents/multiple',
                body: {
                    "data": [
                        {
                            "id":documentId1,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        },
                        {
                            "id":documentId2,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status of Images');
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");

            });
        });
    });

    it('Edit  Image with image with Global Resource CRUD Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.GlobalResourceCRUD,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenGlobalResourceCRUD', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenGlobalResourceCRUD = Cypress.env('accessTokenGlobalResourceCRUD');

            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/documents/multiple',
                body: {
                    "data": [
                        {
                            "id":documentId1,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        },
                        {
                            "id":documentId2,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');

            });
        });
        it.only('Edit  Image with image with Reseller Admin Permission', () => {

        cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body: baseConfig.ResellerAdminPermission,
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

        });
        cy.then(() => {
            const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
            cy.request({
                method: 'GET',
                url: baseConfig.baseUrl + '/documents',
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eql(200, 'Check for Success Status');
                expect(response.body.body.data[0]).to.have.property('id');
                const resellerDocument1 = response.body.body.data[0].id;
                const resellerDocument2 = response.body.body.data[1].id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId1, documentId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
            cy.log("Read The variables")
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                resellerDocument1 = data.resellerDocument1
                resellerDocument2 = data.resellerDocument2
            });
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/documents/multiple',
                body: {
                    "data": [
                        {
                            "id":documentId1,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        },
                        {
                            "id":documentId2,
                            "title": "Cypress Automation Document",
                            "url": baseConfig.pptxDocument,
                            "description": "This is an Description for Documents.",
                            "thumbnail_url": baseConfig.jpegImage,
                            "order": 8,
                            "status": 2,
                            "icon": "far fa-file-powerpoint"
                        }
                    ]
                },
                qs:{
                    domain: "b13ee48a8c6048dfa29927c44e9dc19e"
                },
                headers: {
                    Authorization: `Bearer ${accessTokenResellerAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(200, 'Check for status of Images');

            });
        });
    });
    

});