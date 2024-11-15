import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import type { BaseTextFieldProps } from "@mui/material/TextField/TextField";

interface SearchBarProps extends BaseTextFieldProps {
  // eslint-disable-next-line no-unused-vars
  onSearch: (searchText: string) => void;
  debounceDelay?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, debounceDelay = 300 }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [inputValue, debounceDelay, onSearch]);

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <TextField
      placeholder="Search..."
      variant="outlined"
      data-testid={"searchBar"}
      size="small"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      sx={{ paddingTop: 2, paddingX: 2 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" data-testid={"searchIcon"} />
            </InputAdornment>
          ),
          endAdornment: inputValue && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} data-testid={"clearSearchButton"} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchBar;
