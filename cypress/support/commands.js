import { baseConfig } from "../fixtures/baseConfig";

Cypress.Commands.add('CreateGlobalImages',()=>{
    cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.masterPermissionBody,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env

    });
    cy.then(() => {
        const accessToken = Cypress.env('accessToken');

        cy.request({
            method: 'POST',
            url: baseConfig.baseUrl + '/images/multiple',
            body: {
                "data": [
                    {
                        "title": "Cypress Automation",
                        "url": baseConfig.gifImage,
                        "description": "This is an Description",
                        "status": 1,
                        "icon": "far fa-file-images"
                    },
                    {
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
})

Cypress.Commands.add('LoginWithSuperUserPermissionCy', function() {
    return cy.request({
      method: 'POST',
      url: baseConfig.authUrl,
      body: {
        "username": "superuser@learnyourbenefits.com",
        "password": "lyb@20!9"
      },
      failOnStatusCode: false,
    }).then((response) => {
        Cypress.env('accessToken', response.body.body.access_token);
      });
    });

Cypress.Commands.add('LoginWithReadPermissionUser', () => {
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
});

Cypress.Commands.add('LoginWithMasterAdminPermission', () => {
    cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.masterPermissionBody,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessTokenMasterAdmin', response.body.body.access_token); // Store token in Cypress.env

    });
});

Cypress.Commands.add('LoginWithSiteAdminPermission', () => {
    cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.SiteAdminPermission358,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessTokenSiteAdmin', response.body.body.access_token); // Store token in Cypress.env

    });
});

Cypress.Commands.add('LoginWithGlobalResourceCRUDPermission', () => {
    cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.GlobalResourceCRUD,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessTokenGlobalResourceCRUD', response.body.body.access_token); // Store token in Cypress.env

    });
});

Cypress.Commands.add('LoginWithResellerAdminPermission', () => {
    cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.ResellerAdminPermission,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessTokenResellerAdmin', response.body.body.access_token); // Store token in Cypress.env

    });
})


