  export function loginTestCase (){
        it('Add documents with Invalid api and valid method', () => {
            cy.request({
            method: 'POST',
            url: baseConfig.authUrl,
            body:{
                "username": "superuser@learnyourbenefits.com",
                "password": "lyb@20!9"
            },
            failOnStatusCode: false,
            }).then((response)=>{
                cy.log('Login Response:', JSON.stringify(response));
                Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
    
            });
        });
    }