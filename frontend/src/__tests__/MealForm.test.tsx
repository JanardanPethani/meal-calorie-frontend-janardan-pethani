import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MealForm } from "@/components/meals/MealForm";
import { useMealStore } from "@/lib/stores/mealStore";
import { useAuthStore } from "@/lib/stores/authStore";

// Mock the stores
vi.mock("@/lib/stores/mealStore", () => ({
  useMealStore: () => ({
    fetchCalories: mockFetchCalories,
    isLoading: false,
    error: null,
  }),
  getState: vi.fn().mockReturnValue({
    error: null,
  }),
}));

vi.mock("@/lib/stores/authStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    token: "fake-token",
  }),
}));

// Mock the fetch function
global.fetch = vi.fn(
  () =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
    }) as unknown as Promise<Response>
);

// Define mock outside to use in the mock implementation
const mockFetchCalories = vi.fn();

describe("MealForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset fetch mock
    vi.mocked(global.fetch).mockReset();
  });

  it("renders the form correctly", async () => {
    render(<MealForm />);

    expect(screen.getByLabelText(/dish name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of servings/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /calculate calories/i,
      })
    ).toBeInTheDocument();
  });

  it("validates empty dish name", async () => {
    const user = userEvent.setup();
    render(<MealForm />);

    const servingsInput = screen.getByLabelText(/number of servings/i);
    await user.clear(servingsInput);
    await user.type(servingsInput, "2");

    const submitButton = screen.getByRole("button", {
      name: /calculate calories/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/dish name is required/i)).toBeInTheDocument();
    });

    expect(mockFetchCalories).not.toHaveBeenCalled();
  });

  it("validates invalid servings", async () => {
    const user = userEvent.setup();
    render(<MealForm />);

    const dishNameInput = screen.getByLabelText(/dish name/i);
    await user.clear(dishNameInput);
    await user.type(dishNameInput, "Pizza");

    const servingsInput = screen.getByLabelText(/number of servings/i);
    await user.clear(servingsInput);

    const submitButton = screen.getByRole("button", {
      name: /calculate calories/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Servings must be a positive number/i)
      ).toBeInTheDocument();
    });

    expect(mockFetchCalories).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    const user = userEvent.setup();
    render(<MealForm />);

    const dishNameInput = screen.getByLabelText(/dish name/i);
    await user.clear(dishNameInput);
    await user.type(dishNameInput, "Pizza");

    const servingsInput = screen.getByLabelText(/number of servings/i);
    await user.clear(servingsInput);
    await user.type(servingsInput, "2");

    const submitButton = screen.getByRole("button", {
      name: /calculate calories/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetchCalories).toHaveBeenCalledWith("Pizza", 2);
    });
  });
});
