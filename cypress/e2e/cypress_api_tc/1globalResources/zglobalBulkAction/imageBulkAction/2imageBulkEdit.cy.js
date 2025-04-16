import { baseConfig } from "../../../../../fixtures/baseConfig";
describe('CRUD Operations of the Image', () => {
let imageId1;
let imageId2
let resellerImage1;
let resellerImage2;

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
                  url: baseConfig.baseUrl + '/images',
                 headers:{
                  Authorization : `Bearer ${accessToken}`,
                 },
                 failOnStatusCode: false,
              }).then((response)=>{
                  expect(response.status).to.eql(200, 'Check for Success Status');
                  expect(response.body.body.data[0]).to.have.property('id');
                  const imageId1 = response.body.body.data[0].id;
                  const imageId2 = response.body.body.data[1].id;
  
                  cy.readFile('cypress/fixtures/variables.json').then((data)=>{
                      const updatedData = { ...data, imageId1, imageId2};
                      cy.writeFile('cypress/fixtures/variables.json', updatedData);
                  });
              });
          });
          cy.log("Read The variables")
          cy.readFile('cypress/fixtures/variables.json').then((data) => {
              imageId1 = data.imageId1
              imageId2 = data.imageId2
          });
      });

    it('Edit  images with Invalid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
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

    it('Edit  images with Invalid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PATCH',
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

    it('Edit  images with valid api and Invalid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PATCH',
            url: baseConfig.baseUrl + '/images/multiple',
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

    it('Edit  images with valid api and valid method', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {   
                        "id": imageId1,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });

    it('Edit  images title as Upperlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {   
                        "id": imageId1,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images title as lowerlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "O",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images title as Upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Lorem ipsssum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Images');
            expect(response.body.body['data.0.title']).to.eql(['The data.0.title may not be greater than 255 characters.']);

        });
    });
    it('Edit  images title as empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Images');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
        });
    });

    it('Edit  images title as String.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });

    it('Edit  images title as Alphaneumeric.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "1Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images Description as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": null,
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for success status');
            expect(response.body.body['data.0.description']).to.eql([
                "The data.0.description field is required."
            ]);
        });
    });



    it('Edit  images image type as JPG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.jpgImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as PNG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as JPEG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation Images",
                        "url": baseConfig.jpegImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as Invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation Images",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.",
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Images');
            // expect(response.body.body["data.0.url"]).to.eql([
            //     "TThe data.0.url must end with one of the following: .jpg, .png, .gif, .jpeg, .svg."
            // ]);
        });
    });

    it('Edit  images icon as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
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
    ///////////////////////////////
    it('Edit  images title as Upperlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images title as lowerlimit.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "O",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "O",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images title as Upperlimit+1', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Lorem ipsssum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Lorem ipsssum dolor sit amet, consectetur adipiscing elit. Nulla dictum est a aliquam vulputate. Fusce efficitur tempus sagittis. Proin suscipit, tellus non tincidunt aliquam, nisl ex varius purus, in placerat lacus sapien vel nisi. Vestibulum accumsan leo.",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Images');
            expect(response.body.body['data.0.title']).to.eql(['The data.0.title may not be greater than 255 characters.']);
            expect(response.body.body['data.1.title']).to.eql(['The data.1.title may not be greater than 255 characters.']);


        });
    });
    it('Edit  images title as empty', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error of Images');
            expect(response.body.body["data.0.title"]).to.eql(['The data.0.title field is required.']);
            expect(response.body.body["data.1.title"]).to.eql(['The data.1.title field is required.']);

        });
    });

    it('Edit  images title as String.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });

    it('Edit  images title as Alphaneumeric.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "1Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "1Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description for images.",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images Description as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": null,
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": null,
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Login Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for success status');
            expect(response.body.body['data.0.description']).to.eql([
                "The data.0.description field is required."
            ]);
            expect(response.body.body['data.1.description']).to.eql([
                "The data.1.description field is required."
            ]);
        });
    });



    it('Edit  images image type as JPG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.jpgImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.jpgImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as PNG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.pngImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as JPEG.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation Images",
                        "url": baseConfig.jpegImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation Images",
                        "url": baseConfig.jpegImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as GIF.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(200, 'Check for status of Images');
        });
    });


    it('Edit  images image type as Invalid.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation Images",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.",
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation Images",
                        "url": "https://lycv2.blob.core.windows.net/lycv2/temp/images/MTmhklppxUJR3pSMjsoV9eXq6UFQHzGPLiX36Wbm.",
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    }
                ]
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
        }).then((response) => {
            cy.log('Sites Response:', JSON.stringify(response));
            expect(response.status).to.eql(417, 'Check for error status of Images');
            expect(response.body.body["data.0.url"]).to.eql([
                "The data.0.url must end with one of the following: .jpg, .png, .gif, .jpeg, .svg."
            ]);
            expect(response.body.body["data.1.url"]).to.eql([
                "The data.1.url must end with one of the following: .jpg, .png, .gif, .jpeg, .svg."
            ]);
        });
    });

    it('Edit  images icon as Null.', () => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'PUT',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "id": imageId1,
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
                        "status": 2,
                        "icon": null
                    },
                    {
                        "id": imageId2,
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
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
                url: baseConfig.baseUrl + '/images/multiple',
                body: {
                    "data": [
                        {
                            "id": imageId1,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
                        },
                        {
                            "id": imageId2,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
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
                url: baseConfig.baseUrl + '/images/multiple',
                body: {
                    "data": [
                        {
                            "id": imageId1,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
                        },
                        {
                            "id": imageId2,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
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
                url: baseConfig.baseUrl + '/images/multiple',
                body: {
                    "data": [
                        {
                            "id": imageId1,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
                        },
                        {
                            "id": imageId2,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
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
                url: baseConfig.baseUrl + '/images/multiple',
                body: {
                    "data": [
                        {
                            "id": imageId1,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
                        },
                        {
                            "id": imageId2,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
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

        it('Edit  Image with image with Reseller Admin Permission', () => {
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
                const resellerImage1 = response.body.body.data[0].id;
                const resellerImage2 = response.body.body.data[1].id;

                cy.readFile('cypress/fixtures/variables.json').then((data) => {
                    const updatedData = { ...data, documentId1, documentId2 };
                    cy.writeFile('cypress/fixtures/variables.json', updatedData);
                });
            });
        });
            cy.log("Read The variables")
            cy.readFile('cypress/fixtures/variables.json').then((data) => {
                resellerImage1 = data.resellerImage1
                resellerImage2 = data.resellerImage2
            });
            cy.request({
                method: 'PUT',
                url: baseConfig.baseUrl + '/images/multiple',
                body: {
                    "data": [
                        {
                            "id": resellerImage1,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
                        },
                        {
                            "id": resellerImage2,
                            "title": "Cypress Automation",
                            "url": baseConfig.gifImage,
                            "description": "This is an Description",
                            "status": 1,
                            "icon": "far fa-file-images"
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





