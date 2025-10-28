import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface DomicileInputProps {
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
  };
  fieldState: any;
}

export default function DomicileInput({
  field,
  fieldState,
}: DomicileInputProps) {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // visible input
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formValue = field.value || ""; // regency stored in form

  useEffect(() => {
    if (!inputValue) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) =>
          item.display_name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }
  }, [inputValue, items]);

  const loadData = async () => {
    if (isDataLoaded || isLoading) return;
    setIsLoading(true);
    try {
      const [regenciesModule, provincesModule] = await Promise.all([
        import("../../../data/regencies.json"),
        import("../../../data/provinces.json"),
      ]);
      const regions = regenciesModule.default || regenciesModule;
      const provinceData = provincesModule.default || provincesModule;
      const mapped = regions.map((r: any) => {
        const province = provinceData.find((p: any) => p.id === r.province_id);
        return {
          id: r.id,
          name: r.regency,
          province_id: r.province_id,
          type: r.type,
          province_name: province ? province.province : "",
          display_name: `${r.type} ${r.regency} - ${
            province ? province.province : ""
          }`,
        };
      });
      setItems(mapped);
      setFilteredItems(mapped);
      setIsDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    setInputValue(item.display_name); // show display name
    field.onChange(item.name); // store regency in form
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;

    // Reset inputValue to the display_name of current form value
    const selectedItem = items.find((i) => i.name === formValue);
    setInputValue(selectedItem ? selectedItem.display_name : "");
    setOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <Input
        error={!!fieldState.error}
        errorMessage={fieldState.error?.message}
        placeholder="Choose your domicile"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          setOpen(true);
          if (!isDataLoaded && !isLoading) loadData();
        }}
        onBlur={handleBlur}
        className="w-full pr-10"
      />
      <ChevronDownIcon className="absolute right-3 top-[40%] -translate-y-1/2 h-4 w-4 text-neutral-100 pointer-events-none" />
      {open && (
        <div className="w-full p-0 absolute top-full mt-1 bg-neutral-10 border rounded-lg border-neutral-40 shadow z-10">
          <ScrollArea className="h-72">
            <div className="p-1">
              {isLoading ? (
                <div className="flex items-center justify-center px-3 py-8 text-sm text-neutral-100">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading data...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-100">
                  No results found
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-3 py-2 text-sm hover:bg-primary hover:text-neutral-10 cursor-pointer rounded-sm"
                    tabIndex={0}
                    onClick={() => handleSelect(item)}
                  >
                    {item.display_name}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
