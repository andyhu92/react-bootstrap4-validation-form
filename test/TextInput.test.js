import React from 'react';
import { ValidationForm, TextInput } from '../lib'
import { shallow, render, mount } from 'enzyme';
import toJson from "enzyme-to-json";

describe("<TextInput />", () => {
    let domProps = {
        id: "firstName",
        name:"firstName",
        className: "custom-class",
        "data-custom": 5,
        style: {
            color: "red",
            fontSize: 16
        },
        required:true
    }

    it('should match snapshot when render as input', () => {
        const wrapper = render(<TextInput {...domProps}/>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should match snapshot when render as textarea', () => {
        const wrapper = render(<TextInput {...domProps} multiline/>)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display success message correctly when submit', (done) => {
        const wrapper = mount(
            <ValidationForm onSubmit={doNothing} immediate>
                <TextInput name="firstName" required
                successMessage="Looks Good!" />
            </ValidationForm>
        )
        let input = wrapper.find("input");
        input.instance().value="test";
        wrapper.find('form').simulate('submit');
        let successMessage = <div className="valid-feedback">Looks Good!</div>
        expect(wrapper.containsMatchingElement(successMessage)).toBe(true);
        done();
    })

    it('should display success message correctly when typing', (done) => {
        const wrapper = mount(
            <ValidationForm onSubmit={doNothing} immediate>
                <TextInput name="firstName" required
                successMessage="Looks Good!" />
            </ValidationForm>
        )
        let input = wrapper.find("input");
        input.instance().value="test";
        input.simulate('change');
        let successMessage = <div className="valid-feedback">Looks Good!</div>
        expect(wrapper.containsMatchingElement(successMessage)).toBe(true);
        done();
    })

    
    it('should display error message correctly when submit', (done) => {
        const wrapper = mount(
            <ValidationForm onSubmit={doNothing} immediate>
                <TextInput name="firstName" required />
            </ValidationForm>
        )
        wrapper.find('form').simulate('submit');
        let errorMessage = <div className="invalid-feedback">{defaultErrorMessage.required}</div>
        expect(wrapper.containsMatchingElement(errorMessage)).toBe(true);
        done();
    })

    it('should display error message correctly (immediate)', (done) => {
        const wrapper = mount(
            <ValidationForm onSubmit={doNothing} immediate>
                <TextInput name="firstName" required/>
            </ValidationForm>
        )
        let input = wrapper.find("input");
        input.instance().value="test";
        input.simulate('change');
        input.instance().value="";
        input.simulate('change');
        let errorMessage = <div className="invalid-feedback">{defaultErrorMessage.required}</div>
        expect(wrapper.containsMatchingElement(errorMessage)).toBe(true);
        done();
    })

    it('should display error message correctly (not-immediate)', (done) => {
        const wrapper = mount(
            <ValidationForm onSubmit={doNothing} immediate={false}>
                <TextInput name="firstName" required/>
            </ValidationForm>
        )
        let errorMessage = <div className="invalid-feedback">{defaultErrorMessage.required}</div>
        let input = wrapper.find("input");
        input.instance().value="test";
        input.simulate('change');
        input.instance().value="";
        input.simulate('change');
        expect(wrapper.containsMatchingElement(errorMessage)).toBe(false);
        input.simulate('blur');
        expect(wrapper.containsMatchingElement(errorMessage)).toBe(true);
        done();
    })

    it('should display proper error message correctly when giving different validation attributes', (done) => {
        let minLength=4;
        const wrapper = mount(
            <ValidationForm onSubmit={doNothing}>
                <TextInput name="firstName" 
                    minLength={minLength}
                    pattern="\d+"
                  />
            </ValidationForm>
        )
        let errorMessage = <div className="invalid-feedback">{defaultErrorMessage.minLength.replace("{minLength}", minLength)}</div>
        let input = wrapper.find("input");
        input.instance().value="a";
        input.simulate('change');
        expect(wrapper.containsMatchingElement(errorMessage)).toBe(true);

        errorMessage = <div className="invalid-feedback">{defaultErrorMessage.pattern}</div>
        input.instance().value="abcd";
        input.simulate('change');
        
        expect(wrapper.containsMatchingElement(errorMessage)).toBe(true);
        done();
    })

})