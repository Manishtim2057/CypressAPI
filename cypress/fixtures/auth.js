import { baseConfig } from "../baseConfig";
export function loginAsResellerAdmin() {
    return cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.resellerAdminNayaReseller,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
    });
}

export function loginAsMasterAdmin() {
    return cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.masterPermissionBody,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
    });
}

export function loginAsSuperAdmin() {
    return cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.superadminPermissionBody,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
    });
}

export function loginAsSiteAdmin() {
    return cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.SiteAdminPermission358,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
    });
}

export function loginAsSiteReadPermission() {
    return cy.request({
        method: 'POST',
        url: baseConfig.authUrl,
        body: baseConfig.siteReadPermissionBody,
        failOnStatusCode: false,
    }).then((response) => {
        cy.log('Login Response:', JSON.stringify(response));
        Cypress.env('accessToken', response.body.body.access_token); // Store token in Cypress.env
    });
}