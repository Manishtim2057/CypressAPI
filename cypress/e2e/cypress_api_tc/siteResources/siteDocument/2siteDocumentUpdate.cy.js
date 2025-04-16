import { baseConfig } from "../../../../fixtures/baseConfig";let documentId;

describe('Edit Operations of the Site Document', () => {

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
        cy.log('Create Document')
        cy.then(()=>{
            const accessToken = Cypress.env('accessToken');
            cy.request({
                method: 'POST',
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents`,           
                 body:{
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
             const documentId = response.body.body.id;
                cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                    const updatedData = { ...data, documentId };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                })
            });
        });
        cy.log('Read the variables')
        cy.readFile('cypress\\fixtures\\variables.json').then((data) => {
            documentId = data.documentId
        });
    });

    it('Edit Site Documents with Invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/documentss/sadasda',
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

    it('Edit Site Documents with Invalid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/documentss/asdasd',
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

    it('Edit Site Documents with valid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/sites/358/documents/113',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eq(405, 'Check for Method Not Allowed error');
            expect(response.body.status).to.have.property('message');
            expect(response.body.status.message).to.be.eql('Invalid method call.');

        });
    });

    it('Edit Site Documents with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });
    it('Edit Site Documents Thumbnail as Null', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": null,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql(null);
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });
    it('Edit Site Documents with the API as Undefined', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}/undefined`,
            body: {
                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
        });
    });




    it('Edit Site Documents title as Upperlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents title as lowerlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "O",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('O');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents title as Upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Lorem ipsum dolasddddddddddddor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Documents');
            expect(response.body.body.title[0]).to.eql('The title may not be greater than 255 characters.');

        });
    });
    it('Edit Site Documents title as empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Documents');
            expect(response.body.body.title[0]).to.eql('The title field is required.');
        });
    });

    it('Edit Site Documents title as String.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

    it('Edit Site Documents title as Integer.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents Description as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pdfDocument,
                "description": null,
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql(null);
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });



    it('Edit Site Documents type as PDF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pdfDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents type as DOCX.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.docxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.docx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents type as DOC.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.docDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.doc');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents type as xlsx.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.xlsxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.xlsx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

    it('Edit Site Documents type as xls.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.xlsDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.xls');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

    it('Edit Site Documents type as PPT.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pptDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.ppt');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });
    it('Edit Site Documents type as PPTX.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pptxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pptx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });


    it('Edit Site Documents type as Invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.",
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Documents');
            expect(response.body.body.url[0]).to.eql('The url must end with one of the following: .pdf, .docx, .doc, .xlsx, .xls, .ppt, .pptx.')

        });
    });
    it('Edit Site Documents Thumbnail as type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "vitaephare",
                "url": "https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pdf",
                "description": "String",
                "thumbnail_url": baseConfig.gifImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Documents');
            expect(response.body.body.thumbnail_url[0]).to.eql('The thumbnail url must end with one of the following: .jpg, .png, .jpeg, .svg.');

        });
    });

    it('Edit Site Documents with Thumbnail type as JPG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pptxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.jpgImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pptx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.jpg');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

    it('Edit Site Documents image type as PNG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pptxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.pngImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pptx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.png');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

    it('Edit Site Documents image type as JPEG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pptxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.jpegImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pptx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.jpeg');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

    it('Add documents image type as SVG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
            body: {
                "title": "Cypress Automation Document",
                "url": baseConfig.pptxDocument,
                "description": "This is an Description for Documents.",
                "thumbnail_url": baseConfig.svgImage,
                "order": 8,
                "status": 1,
                "icon": "far fa-file-powerpoint"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Documents');
            expect(response.body.body.title).to.eql('Cypress Automation Document');
            expect(response.body.body.url).to.eql('https://lycv2.blob.core.windows.net/lycv2/documents/yaddBJ9ka7On0vhaWoWkVLKkHO9ouyO5Qb0ni2zG.pptx');
            expect(response.body.body.thumbnail_url).to.eql('https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.svg');
            expect(response.body.body.description).to.eql('This is an Description for Documents.');
            expect(response.body.body.status).to.eql(1);
            expect(response.body.body.icon).to.eql('far fa-file-powerpoint');
        });
    });

   it('Add Documents with All read Permission', () => {
   
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pptxDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.svgImage,
                    "order": 8,
                    "status": 1,
                    "icon": "far fa-file-powerpoint"
                },
                headers: {
                    Authorization: `Bearer ${accessTokenReadPermission}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                   expect(response.status).to.eql(403, 'Check for Success Status');
               });
           });
       });
    it('Add Document with Site Admin Permission', () => {
   
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
                url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
                body: {
                    "title": "Cypress Automation Document",
                    "url": baseConfig.pptxDocument,
                    "description": "This is an Description for Documents.",
                    "thumbnail_url": baseConfig.svgImage,
                    "order": 8,
                    "status": 1,
                    "icon": "far fa-file-powerpoint"
                },
                headers: {
                    Authorization: `Bearer ${accessTokenSiteAdmin}`,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                   expect(response.status).to.eql(200, 'Check for Success Status');
               });
           });
       });

     it('Add the Site Documents with Global Resource CRUD Permission', () => {
    
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
                    url: `${baseConfig.baseUrl}/sites/${baseConfig.siteId}/documents/${documentId}`,
                    body: {
                        "title": "Cypress Automation Document",
                        "url": baseConfig.pptxDocument,
                        "description": "This is an Description for Documents.",
                        "thumbnail_url": baseConfig.svgImage,
                        "order": 8,
                        "status": 1,
                        "icon": "far fa-file-powerpoint"
                    },
                    headers: {
                        Authorization: `Bearer ${accessTokenGlobalResourceCRUD}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                cy.log('Sites Response:', JSON.stringify(response));
                expect(response.status).to.eql(403, 'Check for status for Insufficient permission.');
                expect(response.body.status.message).to.eql("You don't have sufficient permission to perform this action.");

            });
        });
    });

     it('Add the Site Documents with Reseller Admin Permission', () => {
            cy.request({
                method: 'POST',
                url: baseConfig.authUrl,
                body: baseConfig.ResellerAdminPermission,
                failOnStatusCode: false,
            }).then((response) => {
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env
    
            });
            cy.log('Add the Site Documents on the Reseller Site')
            cy.then(() => {
                const accessTokenResellerAdmin = Cypress.env('accessTokenResellerAdmin');
    
                cy.request({
                    method: 'POST',
                    url: `${baseConfig.baseUrl}/sites/${baseConfig.resellerSiteId}/documents`,
                    body: {
                        "title": "Cypress Automation Document Test",
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
                    failOnStatusCode: false,
                }).then((response) => {
                    cy.log('Sites Response:', JSON.stringify(response));
                    expect(response.status).to.eql(200, 'Check for status of Documents');
                    
                });
            });
        });

})