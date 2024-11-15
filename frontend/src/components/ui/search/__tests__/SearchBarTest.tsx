import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "../SearchBar";
import "@testing-library/jest-dom";

jest.useFakeTimers();

describe("SearchBar component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders the SearchBar component with the placeholder", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("always displays the search icon on the left", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByTestId("searchIcon")).toBeInTheDocument();
  });

  it("calls onSearch after debounce delay when typing", () => {
    render(<SearchBar onSearch={mockOnSearch} debounceDelay={50} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });

    // Immediately run pending timers to simulate debounce delay
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(mockOnSearch).toHaveBeenCalledWith("test");
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("clears input and calls onSearch with an empty string when clear button is clicked", () => {
    render(<SearchBar onSearch={mockOnSearch} debounceDelay={50} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "clear me" } });

    // Run pending timers to trigger onSearch with the input value
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(mockOnSearch).toHaveBeenCalledWith("clear me");

    // Click the clear button and check if it clears the input
    const clearButton = screen.getByTestId("clearSearchButton");
    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("does not display the clear button when input is empty initially", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const clearButton = screen.queryByTestId("clearSearchButton");
    expect(clearButton).not.toBeInTheDocument();
  });

  it("displays the clear button when there is text in the input", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "show clear" } });

    // Run pending timers immediately
    act(() => {
      jest.runOnlyPendingTimers();
    });

    const clearButton = screen.getByTestId("clearSearchButton");
    expect(clearButton).toBeInTheDocument();
  });
});
