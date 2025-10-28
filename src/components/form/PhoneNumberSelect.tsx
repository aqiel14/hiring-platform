import React from "react";
import { ButtonGroup } from "../ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { countries } from "@/constants/countries";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { FormMessage } from "../ui/form";
import { CircleSmall } from "lucide-react";

interface Country {
  name: string;
  code: string;
  emoji: string;
}

interface PhoneNumberSelectProps {
  field: any;
  fieldState: any;
  isOpenSelectCountry: boolean;
  setIsOpenSelectCountry: (open: boolean) => void;
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
}

const PhoneNumberSelect = ({
  field,
  fieldState,
  isOpenSelectCountry,
  setIsOpenSelectCountry,
  selectedCountry,
  setSelectedCountry,
}: PhoneNumberSelectProps) => {
  const error = fieldState.error;
  const errorMessage = fieldState.error?.message;

  return (
    <>
      <InputGroup
        className={`w-full border-neutral-40 bg-neutral-10 ${
          error
            ? `border-2 border-danger focus-visible:ring-danger/30 has-[[data-slot=input-group-control]:focus-visible]:ring-danger`
            : ``
        }`}
      >
        <InputGroupAddon align="inline-start">
          <Popover
            open={isOpenSelectCountry}
            onOpenChange={setIsOpenSelectCountry}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-none shadow-none flex items-center justify-center"
                role="combobox"
              >
                {selectedCountry?.emoji}
                <ChevronDownIcon className="w-2 h-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c.name}
                        onSelect={(co) => {
                          setSelectedCountry(c);
                          setIsOpenSelectCountry(false);
                        }}
                      >
                        <span className="mr-2">{c.emoji}</span>
                        {c.name} ({c.code})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <InputGroupText className="font-normal">
            {" "}
            {selectedCountry?.code}
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          className="mt-0.5 "
          placeholder="81XXXXXXXXXXX"
          {...field}
        />
      </InputGroup>
      <div className="flex items-center justify-between text-sm mt-1">
        {/* Left side */}
        <div className="flex gap-1 text-neutral-70">
          {error && <CircleSmall className="w-3 h-3" />}
          <span className="text-danger text-xs">
            {error ? errorMessage : ""}
          </span>
        </div>
      </div>
    </>
  );
};

export default PhoneNumberSelect;
