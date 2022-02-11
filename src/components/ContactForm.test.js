import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const headerElement = screen.queryByText(/Contact Form/i);
    
    expect(headerElement).toBeTruthy();
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent(/Contact Form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    
    const firstName = screen.getByLabelText(/first name*/i);
    userEvent.type(firstName, "123");

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
    
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "melissa");

    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "duplesis");

    const button = screen.getByRole('button');
    userEvent.click(button);

    const messageError = await screen.getAllByTestId('error');
    expect(messageError).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
   render(<ContactForm/>);

   const emailInput = screen.getByLabelText(/email*/i);
   userEvent.type(emailInput, 'melissa@email');

   const errorMessage = await screen.findByText(/email must be a valid email address/i);
   expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const lastNameRequired = screen.getByRole('button');
    userEvent.click(lastNameRequired);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);

    userEvent.type(firstName, "melissa");
    userEvent.type(lastName, "duplesis");
    userEvent.type(emailField, "email@email.com");

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("melissa");
        const lastNameDisplay = screen.queryByText("duplesis");
        const emailDisplay = screen.queryByText("email@email.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect (firstNameDisplay).toBeInTheDocument();
        expect (lastNameDisplay).toBeInTheDocument();
        expect (emailDisplay).toBeInTheDocument();
        expect (messageDisplay).not.toBeInTheDocument();

    });

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);
    const messageField = screen.getByLabelText(/message/i);

    userEvent.type(firstName, "melissa");
    userEvent.type(lastName, "duplesis");
    userEvent.type(emailField, "email@email.com");
    userEvent.type(messageField, "Message Text");

    const button = screen.getByRole('button')
    userEvent.click(button);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("melissa");
        const lastNameDisplay = screen.queryByText("duplesis");
        const emailDisplay = screen.queryByText("email@email.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect (firstNameDisplay).toBeInTheDocument();
        expect (lastNameDisplay).toBeInTheDocument();
        expect (emailDisplay).toBeInTheDocument();
        expect (messageDisplay).toBeInTheDocument();

    });


});