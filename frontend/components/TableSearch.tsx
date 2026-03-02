"use client";
import Image from "next/image";
import { useState } from "react";

interface TableSearchProps {
  onSearch?: (value: string) => void; 
  placeholder?: string;
}

const TableSearch = ({ onSearch, placeholder = "Search..." }: TableSearchProps) => {
  const [value, setValue] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        value={value}          
        onChange={handleChange} 
        placeholder={placeholder}
        className="w-50 p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;