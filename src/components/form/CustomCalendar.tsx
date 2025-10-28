import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Calendar } from "../ui/calendar";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import ErrorMessageForm from "./ErrorMessageForm";

interface CustomCalendarProps {
  field: any;
  fieldState: any;
  isOpenDatePicker: boolean;
  setIsOpenDatePicker: (open: boolean) => void;
}

export function CustomCalendar({
  isOpenDatePicker,
  setIsOpenDatePicker,
  field,
  fieldState,
}: CustomCalendarProps) {
  const error = fieldState.error;
  const errorMessage = fieldState.error?.message;
  return (
    <>
      <Popover open={isOpenDatePicker} onOpenChange={setIsOpenDatePicker}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal bg-neutral-10 border-2 border-neutral-40 outline-none shadow-xs "
          >
            <div className="flex gap-2 justify-center items-center text-neutral-90">
              <CalendarIcon className="h-4 w-4 text-neutral-100" />
              {field.value
                ? new Date(field.value).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Select date"}
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              field.onChange(date);
              setIsOpenDatePicker(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <ErrorMessageForm error={error} errorMessage={errorMessage} />
    </>
  );
}
