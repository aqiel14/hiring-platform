import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CircleSmall } from "lucide-react";
import ErrorMessageForm from "./ErrorMessageForm";

interface GenderRadioProps {
  field: any;
  fieldState: any;
}

const GenderRadio = ({ field, fieldState }: GenderRadioProps) => {
  const error = fieldState.error;
  const errorMessage = fieldState.error?.message;
  return (
    <>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="sheher" />
          <label htmlFor="sheher" className="text-sm font-medium leading-none">
            She/her(Female)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="hehim" />
          <label htmlFor="hehim" className="text-sm font-medium leading-none">
            He/him(Male)
          </label>
        </div>
      </RadioGroup>
      <ErrorMessageForm error={error} errorMessage={errorMessage} />
      {errorMessage}
    </>
  );
};

export default GenderRadio;
