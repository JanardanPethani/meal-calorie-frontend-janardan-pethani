import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MealForm } from "@/components/meals/MealForm";
import { useMealStore } from "@/lib/stores/mealStore";
import { useAuthStore } from "@/lib/stores/authStore";

// Mock the stores
vi.mock("@/lib/stores/mealStore", () => ({
  useMealStore: vi.fn(),
}));

vi.mock("@/lib/stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock the fetch function
global.fetch = vi.fn();

describe("MealForm Component", () => {
  const mockGetCalories = vi.fn();
  const mockIsLoading = false;
  const mockError = null;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the meal store
    useMealStore.mockReturnValue({
      getCalories: mockGetCalories,
      isLoading: mockIsLoading,
      error: mockError,
    });

    // Mock the auth store
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      token: "fake-token",
    });

    // Reset fetch mock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockReset();
  });

  it("renders the form correctly", () => {
    render(<MealForm />);

    expect(screen.getByLabelText(/dish name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calculate/i })
    ).toBeInTheDocument();
  });

  it("validates empty dish name", async () => {
    render(<MealForm />);

    const servingsInput = screen.getByLabelText(/servings/i);
    fireEvent.change(servingsInput, { target: { value: "2" } });

    const submitButton = screen.getByRole("button", { name: /calculate/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/dish name is required/i)).toBeInTheDocument();
    });

    expect(mockGetCalories).not.toHaveBeenCalled();
  });

  it("validates invalid servings", async () => {
    render(<MealForm />);

    const dishNameInput = screen.getByLabelText(/dish name/i);
    fireEvent.change(dishNameInput, { target: { value: "Pizza" } });

    const servingsInput = screen.getByLabelText(/servings/i);
    fireEvent.change(servingsInput, { target: { value: "0" } });

    const submitButton = screen.getByRole("button", { name: /calculate/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/servings must be greater than 0/i)
      ).toBeInTheDocument();
    });

    expect(mockGetCalories).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    render(<MealForm />);

    const dishNameInput = screen.getByLabelText(/dish name/i);
    fireEvent.change(dishNameInput, { target: { value: "Pizza" } });

    const servingsInput = screen.getByLabelText(/servings/i);
    fireEvent.change(servingsInput, { target: { value: "2" } });

    const submitButton = screen.getByRole("button", { name: /calculate/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGetCalories).toHaveBeenCalledWith({
        dish_name: "Pizza",
        servings: 2,
      });
    });
  });
});
